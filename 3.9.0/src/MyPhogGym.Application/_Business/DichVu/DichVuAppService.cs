using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using MyPhogGym._Business.DichVu.Dto;
using MyPhogGym._Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.DichVu
{
    [AbpAuthorize]
    public class DichVuAppService : AsyncCrudAppService<Entity.DichVu, DichVuDto, Guid, GetAllDichVuInput>, IDichVuAppService
    {
        private readonly IRepository<Entity.DichVu, Guid> _dichVuRepository;
        private readonly IRepository<KhachHang.Entity.KhachHang, Guid> _khachHangRepository;

        #region khời tạo
        public DichVuAppService(
            IRepository<Entity.DichVu, Guid> dichVuRepository,
            IRepository<KhachHang.Entity.KhachHang, Guid> khachHangRepository) : base(dichVuRepository)
        {
            _dichVuRepository = dichVuRepository;
            _khachHangRepository = khachHangRepository;
        }
        #endregion

        private IQueryable<Entity.DichVu> Search(GetAllDichVuInput input, IQueryable<Entity.DichVu> dichVus)
        {
            return dichVus.Where(w => w.TenDichVu.Contains(input.KeySearch));
        }

        #region get all
        public override async Task<PagedResultDto<DichVuDto>> GetAll(GetAllDichVuInput input)
        {
            var dichVus = _dichVuRepository.GetAll();

            if (input.KeySearch != null)
                dichVus = this.Search(input, dichVus);

            var count = dichVus.Count();

            dichVus = dichVus.OrderByDescending(o => o.CreationTime).PageBy(input);

            var result = new PagedResultDto<DichVuDto>
            (

               totalCount: count,
               items: ObjectMapper.Map<List<DichVuDto>>(dichVus)
            );
            return await Task.FromResult(result);
        }
        #endregion

        #region delete
        public override Task Delete(EntityDto<Guid> input)
        {
            _khachHangRepository.GetAll().Where(w => w.DichVuID == input.Id).ToList().ForEach(f =>  f.DangKy = null);
            return base.Delete(input);
        }
        #endregion
    }
}

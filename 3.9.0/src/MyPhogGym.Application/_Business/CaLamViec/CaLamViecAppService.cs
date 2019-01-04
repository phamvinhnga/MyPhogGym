using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using MyPhogGym._Business.CaLamViec.Dto;
using MyPhogGym._Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.CaLamViec
{
    [AbpAuthorize]
    public class CaLamViecAppService : AsyncCrudAppService<Entity.CaLamViec, CaLamViecDto, Guid, GetAllCaLamViecInput>, ICaLamViecAppService
    {
        private readonly IRepository<Entity.CaLamViec, Guid> _caLamViecRepository;

        #region khời tạo
        public CaLamViecAppService(
            IRepository<Entity.CaLamViec, Guid> caLamViecRepository) : base(caLamViecRepository)
        {
            _caLamViecRepository = caLamViecRepository;
        }
        #endregion

        #region bộ lọc

        private IQueryable<Entity.CaLamViec> FilterData(GetAllCaLamViecInput input, IQueryable<Entity.CaLamViec> caLamViecs)
        {
            switch ( input.FilterTrangThai)
            {
                case (int)CaLamViecTrangThai.HIEULUC:
                    caLamViecs = caLamViecs.Where(w => w.TrangThai == true);
                    break;
                case (int)CaLamViecTrangThai.HETHIEULUC:
                    caLamViecs = caLamViecs.Where(w => w.TrangThai == false);
                    break;
            }
            return caLamViecs;
        }

        private IQueryable<Entity.CaLamViec> Search(GetAllCaLamViecInput input, IQueryable<Entity.CaLamViec> caLamViecs)
        {
            return caLamViecs.Where(w => w.TenCa.Contains(input.KeySearch));
        }
        #endregion

        #region get all
        public override async Task<PagedResultDto<CaLamViecDto>> GetAll(GetAllCaLamViecInput input)
        {
            var caLamViecs = _caLamViecRepository.GetAll();

            caLamViecs = this.FilterData(input, caLamViecs);

            if (input.KeySearch != null)
                caLamViecs = this.Search(input, caLamViecs);

            var count = caLamViecs.Count();

            caLamViecs = caLamViecs.OrderByDescending(o => o.CreationTime).PageBy(input);

            var result = new PagedResultDto<CaLamViecDto>
            (
               totalCount: _caLamViecRepository.Count(),
               items: ObjectMapper.Map<List<CaLamViecDto>>(caLamViecs)
            );
            return await Task.FromResult(result);
        }
        #endregion

        #region create
        //public override async Task<CaLamViecDto> Create(CaLamViecDto input)
        //{
        //    var calamviec = input.MapTo<Entity.CaLamViec>();
        //    var result = await _caLamViecRepository.InsertAsync(calamviec);
        //    return result.MapTo<CaLamViecDto>();
        //}
        #endregion

        #region update
        //public override async Task<CaLamViecDto> Update(CaLamViecDto input)
        //{
        //    var calamviec = await _caLamViecRepository.GetAsync(input.Id);
        //    if (calamviec == null)
        //    {
        //        throw new NotImplementedException();
        //    }
        //    else
        //    {
        //        input.MapTo(calamviec);
        //        await _caLamViecRepository.UpdateAsync(calamviec);
        //    }
        //    return calamviec.MapTo<CaLamViecDto>();
        //}
        #endregion

        #region get
        //public override async Task<CaLamViecDto> Get(EntityDto<Guid> input)
        //{
        //    var calamviec = await _caLamViecRepository.GetAsync(input.Id);
        //    if (calamviec == null)
        //    {
        //        throw new NotImplementedException();
        //    }
        //    return calamviec.MapTo<CaLamViecDto>();
        //}
        #endregion

        #region delte
        //public override async Task Delete(EntityDto<Guid> input)
        //{
        //    await _caLamViecRepository.DeleteAsync(input.Id);
        //}
        #endregion
    }
}

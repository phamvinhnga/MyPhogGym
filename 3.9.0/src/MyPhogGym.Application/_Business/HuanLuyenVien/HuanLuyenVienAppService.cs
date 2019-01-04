using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using MyPhogGym._Business.HuanLuyenVien.Dto;
using MyPhogGym._Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.HuanLuyenVien
{
    [AbpAuthorize]
    public class HuanLuyenVienAppService : AsyncCrudAppService<Entity.HuanLuyenVien, HuanLuyenVienDto, Guid, GetAllHuanLuyenVienInput> , IHuanLuyenVienAppService
    {

        private readonly IRepository<Entity.HuanLuyenVien, Guid> _huanLuyenVienRepository;
        private readonly IRepository<LichLamViec.Entity.LichLamViec, Guid> _lichLamViecRepository;

        #region khởi tạo
        public HuanLuyenVienAppService(
            IRepository<Entity.HuanLuyenVien, Guid> huanLuyenVienRepository,
            IRepository<LichLamViec.Entity.LichLamViec, Guid> lichLamViecRepository) : base(huanLuyenVienRepository)
        {
            _huanLuyenVienRepository = huanLuyenVienRepository;
            _lichLamViecRepository = lichLamViecRepository;
        }
        #endregion

        #region bộ lọc
        private IQueryable<Entity.HuanLuyenVien> FilterData(GetAllHuanLuyenVienInput input, IQueryable<Entity.HuanLuyenVien> huanLuyenViens)
        {
            switch (input.FilterTrangThai)
            {
                case (int)HuanLuyenVienTrangThai.DANGLAM:
                    huanLuyenViens = huanLuyenViens.Where(w => w.TrangThai == true);
                    break;
                case (int)HuanLuyenVienTrangThai.NGHIVIEC:
                    huanLuyenViens = huanLuyenViens.Where(w => w.TrangThai == false);
                    break;
            }
            switch (input.FilterHopDong)
            {
                case (int)HuanLuyenVienHopDong.HOPDONGTHUVIEC:
                    huanLuyenViens = huanLuyenViens.Where(w => w.HopDong == (int)HuanLuyenVienHopDong.HOPDONGTHUVIEC);
                    break;
                case (int)HuanLuyenVienHopDong.HOPDONGLAODONG:
                    huanLuyenViens = huanLuyenViens.Where(w => w.HopDong == (int)HuanLuyenVienHopDong.HOPDONGLAODONG);
                    break;
            }
            return huanLuyenViens;
        }

        private IQueryable<Entity.HuanLuyenVien> Search(GetAllHuanLuyenVienInput input, IQueryable<Entity.HuanLuyenVien> huanLuyenViens)
        {
            return huanLuyenViens.Where(w => w.HoTen.Contains(input.KeySearch));
        }
        #endregion

        #region get all
        public async override Task<PagedResultDto<HuanLuyenVienDto>> GetAll(GetAllHuanLuyenVienInput input)
        {
            var huanLuyenViens = _huanLuyenVienRepository.GetAll();

            huanLuyenViens = this.FilterData(input, huanLuyenViens);

            if (input.KeySearch != null)
                huanLuyenViens = this.Search(input, huanLuyenViens);

            var count = huanLuyenViens.Count();

            huanLuyenViens = huanLuyenViens.OrderByDescending(o => o.CreationTime).PageBy(input);

            var result = new PagedResultDto<HuanLuyenVienDto>
            (
               totalCount: count,
               items: ObjectMapper.Map<List<HuanLuyenVienDto>>(huanLuyenViens)
            );
            return await Task.FromResult(result);
        }
        #endregion

        #region delete
        public override async Task Delete(EntityDto<Guid> input)
        {
            var lichLamViec = _lichLamViecRepository.GetAll().Where(w => w.ID_HLV == input.Id).FirstOrDefault();
            await _huanLuyenVienRepository.DeleteAsync(input.Id);
        }
        #endregion
    }
}

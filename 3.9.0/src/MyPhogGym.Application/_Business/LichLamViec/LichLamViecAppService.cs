using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using MyPhogGym._Business.LichLamViec.Dto;
using MyPhogGym._Enumerations;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.LichLamViec
{
    [AbpAuthorize]
    public class LichLamViecAppService : AsyncCrudAppService<Entity.LichLamViec, LichLamViecDto, Guid, GetAllLichLamViecInput>, ILichLamViecAppService
    {
        private readonly IRepository<Entity.LichLamViec, Guid> _lichLamViecRepository;
        private readonly IRepository<HuanLuyenVien.Entity.HuanLuyenVien, Guid> _huanLuyenVienRepository;
        private readonly IRepository<CaLamViec.Entity.CaLamViec, Guid> _caLamViecRepository;

        #region  khời tạo
        public LichLamViecAppService(
            IRepository<Entity.LichLamViec, Guid> lichLamViecRepository,
            IRepository<HuanLuyenVien.Entity.HuanLuyenVien, Guid> huanLuyenVienRepository,
            IRepository<CaLamViec.Entity.CaLamViec, Guid> caLamViecRepository
        ) : base(lichLamViecRepository)
        {
            _lichLamViecRepository = lichLamViecRepository;
            _huanLuyenVienRepository = huanLuyenVienRepository;
            _caLamViecRepository = caLamViecRepository;
        }
        #endregion

        #region bộ lọc

        private IQueryable<Entity.LichLamViec> FilterData(GetAllLichLamViecInput input, IQueryable<Entity.LichLamViec> lichLamViecs)
        {
            switch (input.FilterTrangThai)
            {
                case (int)HuanLuyenVienTrangThai.DANGLAM:
                    lichLamViecs = lichLamViecs.Where(w => w.HuanLuyenVien.TrangThai == true);
                    break;
                case (int)HuanLuyenVienTrangThai.NGHIVIEC:
                    lichLamViecs = lichLamViecs.Where(w => w.HuanLuyenVien.TrangThai == false);
                    break;
            }
            return lichLamViecs;
        }

        private IQueryable<Entity.LichLamViec> Search(GetAllLichLamViecInput input, IQueryable<Entity.LichLamViec> lichLamViecs)
        {
            return lichLamViecs.Where(w => w.HuanLuyenVien.HoTen.Contains(input.KeySearch));
        }
        #endregion

        #region get all
        public override async Task<PagedResultDto<LichLamViecDto>> GetAll(GetAllLichLamViecInput input)
        {
            var lichLamViecs = _lichLamViecRepository.GetAll();
            lichLamViecs = FilterData(input, lichLamViecs);
            if (input.KeySearch != null)
                lichLamViecs = this.Search(input, lichLamViecs);

            var count = lichLamViecs.Count();

            lichLamViecs = lichLamViecs.OrderByDescending(o => o.CreationTime).PageBy(input);

            var result = new PagedResultDto<LichLamViecDto>
            (
               totalCount: count,
               items: ObjectMapper.Map<List<LichLamViecDto>>(lichLamViecs.ToList())
            );
            return await Task.FromResult(result);
        }
        #endregion

        #region lấy danh sach huấn luyện viên
        public List<HuanLuyenVien.Dto.GetHoTenTrangThaiHuanLuyenVienDto> GetAllHuanLuyenVien(EntityDto<Guid> input)
        {
            var huanLuyenViens = _huanLuyenVienRepository.GetAll().Where(w => w.TrangThai == true);

            var huanLuyenVienLichLamViecs = _lichLamViecRepository.GetAll().Where(w => w.ID_HLV != input.Id);

            var result = huanLuyenViens.Where(w => !huanLuyenVienLichLamViecs.Any(a => a.ID_HLV == w.Id)).OrderByDescending(o => o.CreationTime).ToList();

            return result.MapTo<List<HuanLuyenVien.Dto.GetHoTenTrangThaiHuanLuyenVienDto>>();
        }
        #endregion

        #region lấy danh sách ca làm việc
        public List<CaLamViec.Dto.CaLamViecTenCaDto> GetAllCaLamViec()
        {
            var caLamViecs = _caLamViecRepository.GetAll().Where(w => w.TrangThai == true).OrderByDescending(o => o.CreationTime).ToList();

            return caLamViecs.MapTo<List<CaLamViec.Dto.CaLamViecTenCaDto>>();
        }
        #endregion
    }
}

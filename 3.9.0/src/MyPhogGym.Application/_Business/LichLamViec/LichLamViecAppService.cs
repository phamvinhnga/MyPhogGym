using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using MyPhogGym._Business.CaLamViec.Dto;
using MyPhogGym._Business.HuanLuyenVien.Dto;
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
    public class LichLamViecAppService : AsyncCrudAppService<Entity.LichLamViec, LichLamViecDto, Guid, GetAllLichLamViecInput, CreateUpdateLichLamViecInput, CreateUpdateLichLamViecInput>, ILichLamViecAppService
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

        #region lấy danh sách ca làm việc
        public List<CaLamViecHuanLuyenVienDto> GetAllCaLamViec()
        {
            var caLamViecs = _caLamViecRepository.GetAll().Where(w => w.TrangThai == true).OrderByDescending(o => o.CreationTime).ToList();
            return caLamViecs.MapTo<List<CaLamViecHuanLuyenVienDto>>();
        }
        #endregion

        #region lấy danh sach huấn luyện viên
        public List<HuanLuyenVienDto> GetAllHuanLuyenVien()
        {
            var huanLuyenViens = _huanLuyenVienRepository.GetAll().Where(w => w.TrangThai == true);

            var huanLuyenVienLichLamViecs = _lichLamViecRepository.GetAll();

            var result = huanLuyenViens.Where(w => !huanLuyenVienLichLamViecs.Any(a => a.HuanLuyenVienID == w.Id)).OrderByDescending(o => o.CreationTime).ToList();

            return result.MapTo<List<HuanLuyenVienDto>>();
        }
        #endregion

        public HuanLuyenVienLichLamViecDto GetLichLamViecHuanLuyenVien(EntityDto<Guid> input)
        {
            var lichLamViecHuanLuyenVien = _lichLamViecRepository.GetAllList().Where(w => w.HuanLuyenVienID == input.Id);
            var caLamViecs = _caLamViecRepository.GetAll().Where(w => w.TrangThai == true).OrderByDescending(o => o.CreationTime).ToList();
            if (caLamViecs.Count() > lichLamViecHuanLuyenVien.Count())
            {
                var caLamViecTrong = caLamViecs.ToList().Where(w => !lichLamViecHuanLuyenVien.Any(a => a.CaLamViecID == w.Id)).OrderByDescending(o => o.CreationTime);
                foreach (var caLamViec in caLamViecTrong)
                {
                    var lichLamViecInput = new CreateUpdateLichLamViecInput() { HuanLuyenVienID = input.Id, CaLamViecID = caLamViec.Id }.MapTo<Entity.LichLamViec>();
                    var lichLamViec = _lichLamViecRepository.Insert(lichLamViecInput);
                }
            }
            var huanLuyenVien = _huanLuyenVienRepository.Get(input.Id);

            return huanLuyenVien.MapTo<HuanLuyenVienLichLamViecDto>();
        }

    }
}
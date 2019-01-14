using Abp.Application.Services;
using Abp.Application.Services.Dto;
using MyPhogGym._Business.CaLamViec.Dto;
using MyPhogGym._Business.HuanLuyenVien.Dto;
using MyPhogGym._Business.LichLamViec.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.LichLamViec
{
    public interface ILichLamViecAppService : IAsyncCrudAppService<LichLamViecDto, Guid, GetAllLichLamViecInput, CreateUpdateLichLamViecInput, CreateUpdateLichLamViecInput>, IApplicationService
    {
        List<HuanLuyenVienDto> GetAllHuanLuyenVien();
        List<CaLamViecHuanLuyenVienDto> GetAllCaLamViec();
        HuanLuyenVienLichLamViecDto GetLichLamViecHuanLuyenVien(EntityDto<Guid> input);
    }
}

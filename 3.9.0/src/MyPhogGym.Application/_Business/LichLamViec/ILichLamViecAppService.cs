using Abp.Application.Services;
using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.LichLamViec
{
    public interface ILichLamViecAppService : IAsyncCrudAppService<Dto.LichLamViecDto, Guid, Dto.GetAllLichLamViecInput>, IApplicationService
    {
        List<HuanLuyenVien.Dto.GetHoTenTrangThaiHuanLuyenVienDto> GetAllHuanLuyenVien(EntityDto<Guid> input);
        List<CaLamViec.Dto.CaLamViecTenCaDto> GetAllCaLamViec();
    }
}

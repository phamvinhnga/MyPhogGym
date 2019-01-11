using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using AutoMapper;
using MyPhogGym._Business.KhachHang.KhachHangDenTap.Dto;
using MyPhogGym._Enumerations;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.KhachHang.KhachHangDenTap
{
    public class KhachHangDenTapAppService : AsyncCrudAppService<Entity.KhachHangDenTap, KhachHangDenTapDto, Guid, GetAllKhachHangDenTapInput>, IKhachHangDenTapAppService
    {
        private readonly IRepository<Entity.KhachHangDenTap, Guid> _khachHangDenTapRepository;
        private readonly IRepository<QuanLyKhachHang.Entity.KhachHang, Guid> _khachHangRepository;

        #region khởi tạo
        public KhachHangDenTapAppService(
            IRepository<Entity.KhachHangDenTap, Guid> khachHangDenTapRepository,
            IRepository<QuanLyKhachHang.Entity.KhachHang, Guid> khachHangRepository) : base(khachHangDenTapRepository)
        {
            _khachHangDenTapRepository = khachHangDenTapRepository;
            _khachHangRepository = khachHangRepository;
        }
        #endregion

        #region bộ lọc
        private IQueryable<Entity.KhachHangDenTap> Search(GetAllKhachHangDenTapInput input, IQueryable<Entity.KhachHangDenTap> khachHangs)
        {
            return khachHangs.Where(w => w.KhachHang.HoTen.Contains(input.KeySearch));
        }

        private IQueryable<Entity.KhachHangDenTap> FilterData(GetAllKhachHangDenTapInput input, IQueryable<Entity.KhachHangDenTap> khachHang)
        {
            switch (input.TrangThai)
            {
                case (int)khachHangDenTap.DANGTAP:
                    khachHang = khachHang.Where(w => w.TrangThai == true);
                    break;
                case (int)khachHangDenTap.HETGIOTAP:
                    khachHang = khachHang.Where(w => w.TrangThai == false);
                    break;
            }
            if(input.DichVuID != null)
            {
                khachHang = khachHang.Where(w => w.KhachHang.DichVu.Id == input.DichVuID);
            }
            return khachHang;
        }
        #endregion

        private async Task UpdateDanhSachKhachHangDenTap()
        {
            var khachHangs = await _khachHangDenTapRepository.GetAllListAsync();
            foreach (var item in khachHangs)
            {
                if (item.CreationTime.Date < DateTime.Now.Date)
                {
                    await _khachHangDenTapRepository.DeleteAsync(item.Id);
                    continue;
                }
                DateTime timeEnd = DateTime.Parse(item.KhachHang.DichVu.GioKetThuc);
                item.SoPhutConlai = (int)timeEnd.Subtract(DateTime.Now).TotalMinutes;
                item.TrangThai = item.SoPhutConlai > 0 ? true : false;
            }
        }

        public async override Task<PagedResultDto<KhachHangDenTapDto>> GetAll(GetAllKhachHangDenTapInput input)
        {
            await UpdateDanhSachKhachHangDenTap();

            var khachHangs = _khachHangDenTapRepository.GetAll();

            if (input.KeySearch != null)
            {
                khachHangs = Search(input, khachHangs);
            }

            khachHangs = FilterData(input, khachHangs);

            khachHangs = khachHangs.OrderByDescending(o => o.CreationTime).PageBy(input);

            var result = new PagedResultDto<KhachHangDenTapDto>
            (
               totalCount: await _khachHangDenTapRepository.CountAsync(),
               items: ObjectMapper.Map<List<KhachHangDenTapDto>>(khachHangs.ToList())
            );
            return await Task.FromResult(result);
        }

        private string KiemTraThoiHanTap(QuanLyKhachHang.Entity.KhachHang khachHang)
        {
            var dichVu = khachHang.DichVu;
            if (DateTime.Today < dichVu.NgayBatDau || DateTime.Today > dichVu.NgayKetThuc)
            {
                return "Gói tập chưa bắt đầu từ ngày " + dichVu.NgayBatDau.ToString() + " đến ngày " + dichVu.NgayKetThuc.ToString();
            }
            //else if (khachHang.NgayDangKy < khachHang.DichVu.NgayBatDau)
            //{
            //    return "SUCCESS";
            //}
            //else if (khachHang.NgayDangKy > khachHang.DichVu.NgayKetThuc)
            //{
            //    return "SUCCESS";
            //}
            return "SUCCESS";
        }

        private string KiemTraThuTap(DichVu.Entity.DichVu dichVu)
        {
            var today = DateTime.Today.DayOfWeek.ToString();
            string messager = "Bạn đi tập không đúng ngày.";
            if (dichVu.LoaiGoi == (int)DichVuLoaiGoi.THANG)
            {
                return "SUCCESS";
            }
            else
            {
                dynamic lichTap = JObject.Parse(dichVu.LichTap);
                switch (today)
                {
                    case "Monday":
                        messager = lichTap.thuHai == true ? "SUCCESS" : messager;
                        break;
                    case "Tuesday":
                        messager = lichTap.thuBa == true ? "SUCCESS" : messager;
                        break;
                    case "Wednesday":
                        messager = lichTap.thuTu == true ? "SUCCESS" : messager;
                        break;
                    case "Thursday":
                        messager = lichTap.thuNam == true ? "SUCCESS" : messager;
                        break;
                    case "Friday":
                        messager = lichTap.thuSau == true ? "SUCCESS" : messager;
                        break;
                    case "Saturday":
                        messager = lichTap.thuBay == true ? messager : "SUCCESS";
                        break;
                    case "Sunday":
                        messager = lichTap.chuNhat == true ? messager : "SUCCESS";
                        break;
                }
            }
            return messager;
        }

        private string KiemTraGioTap(DichVu.Entity.DichVu dichVu)
        {
            var timeNow = DateTime.Now;
            DateTime timeStart = Convert.ToDateTime(dichVu.GioBatDau);
            DateTime timeEnd = Convert.ToDateTime(dichVu.GioKetThuc);
            if(timeNow.TimeOfDay.Ticks < timeStart.TimeOfDay.Ticks)
            {
                return "Thời gian tập chưa bắt đầu.";
            }
            else if(timeNow.TimeOfDay.Ticks > timeEnd.TimeOfDay.Ticks)
            {
                return "Thời gian tập đã kết thúc";
            }
            return "SUCCESS";
        }

        private string KiemTraGoiTap(QuanLyKhachHang.Entity.KhachHang khachHang)
        {
            var dichVu = khachHang.DichVu;
            switch (dichVu.LoaiGoi)
            {
                case (int)DichVuLoaiGoi.THANG:
                    return "SUCCESS";
                case (int)DichVuLoaiGoi.BUOI:
                    if (khachHang.ConLai > 0)
                    {
                        khachHang.ConLai -= 1;
                        return "SUCCESS";
                    }
                    return "Số buổi tập đã hết";
                case (int)DichVuLoaiGoi.NGAY:
                    if (khachHang.ConLai > 0)
                    {
                        khachHang.ConLai -= 1;
                        return "SUCCESS";
                    }
                    return "Số buổi tập đã hết";
                default:
                    break;
            }
            return "SUCCESS";
        }

        public async Task<string> KhachHangQuetThe(EntityDto<Guid> input)
        {
            var khachHang = await _khachHangRepository.GetAsync(input.Id);
            var khachHangDenTap = _khachHangDenTapRepository.FirstOrDefault(f => f.KhachHangID == input.Id);
            if (khachHangDenTap == null)
            {
                if (khachHang.DichVu != null)
                {
                    var messager = KiemTraThoiHanTap(khachHang);
                    if (messager != "SUCCESS") return messager;
                    messager = KiemTraThuTap(khachHang.DichVu);
                    if (messager != "SUCCESS") return messager;
                    messager = KiemTraGioTap(khachHang.DichVu);
                    if (messager != "SUCCESS") return messager;
                    messager = KiemTraGoiTap(khachHang);
                    if (messager != "SUCCESS") return messager;
                    var insert = new KhachHangDenTapDto() { KhachHangID = input.Id };
                    var inserKhachHangQuetThe = _khachHangDenTapRepository.InsertAsync(insert.MapTo<Entity.KhachHangDenTap>());
                    return messager;
                }
                else
                {
                    return "Chưa đăng ký gói tập";
                }
            }
            else
            {
                await Delete(new EntityDto<Guid>() { Id = khachHangDenTap.Id });
                return "KTBT";
            }
        }

        public override Task<KhachHangDenTapDto> Create(KhachHangDenTapDto input)
        {
            return base.Create(input);
        }

        public override Task Delete(EntityDto<Guid> input)
        {
            return base.Delete(input);
        }

        public override Task<KhachHangDenTapDto> Get(EntityDto<Guid> input)
        {
            return base.Get(input);
        }
    }
}

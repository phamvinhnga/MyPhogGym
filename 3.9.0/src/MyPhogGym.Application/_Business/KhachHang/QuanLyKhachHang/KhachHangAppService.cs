using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using IronBarCode;
using MyPhogGym._Business.KhachHang.QuanLyKhachHang.Dto;
using MyPhogGym._Enumerations;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyPhogGym._Business.KhachHang.QuanLyKhachHang
{
    [AbpAuthorize]
    public class KhachHangAppService : AsyncCrudAppService<Entity.KhachHang, KhachHangDto, Guid, GetAllKhachHangInput, CreateKhachHangInput>, IKhachHangAppService
    {
        private readonly IRepository<Entity.KhachHang, Guid> _khachHangRepository;
        private readonly IRepository<DichVu.Entity.DichVu, Guid> _dichVuRepository;

        #region khởi tạo
        public KhachHangAppService(
            IRepository<Entity.KhachHang, Guid> khachHangRepository,
            IRepository<DichVu.Entity.DichVu, Guid> dichVuRepository) : base(khachHangRepository)
        {
            _khachHangRepository = khachHangRepository;
            _dichVuRepository = dichVuRepository;
        }
        #endregion

        #region bộ lọc
        private IQueryable<Entity.KhachHang> Search(GetAllKhachHangInput input, IQueryable<Entity.KhachHang> khachHangs)
        {
            return khachHangs.Where(w => w.HoTen.Contains(input.KeySearch));
        }
        #endregion

        #region get all
        public async override Task<PagedResultDto<KhachHangDto>> GetAll(GetAllKhachHangInput input)
        {
            var khachHangs = _khachHangRepository.GetAll();

            if (input.KeySearch != null)
                khachHangs = this.Search(input, khachHangs);

            var count = khachHangs.Count();

            khachHangs = khachHangs.OrderByDescending(o => o.CreationTime).PageBy(input);

            var result = new PagedResultDto<KhachHangDto>
            (
               totalCount: count,
               items: ObjectMapper.Map<List<KhachHangDto>>(khachHangs.ToList())
            );
            return await Task.FromResult(result);
        }
        #endregion

        #region đăng ký gói tập
        public async Task<KhachHangDto> DangKyGoiTap(GoiTapKhachHangInput input)
        {
            var khachHang = await _khachHangRepository.GetAsync(input.Id);
            if (khachHang == null)
            {
                throw new NotImplementedException();
            }
            else
            {
                input.MapTo(khachHang);
                await _khachHangRepository.UpdateAsync(khachHang);
            }
            return khachHang.MapTo<KhachHangDto>();
        }
        #endregion
 
        public async Task<KhachHangDto> HuyGoiTap(GoiTapKhachHangInput input)
        {
            var khachHang = await _khachHangRepository.GetAsync(input.Id);
            if (khachHang == null)
            {
                throw new NotImplementedException();
            }
            else
            {
                input.MapTo(khachHang);
                await _khachHangRepository.UpdateAsync(khachHang);
            }
            return khachHang.MapTo<KhachHangDto>();
        }
        #region tạo mã vạch
        //public async Task<string> CreateBarCode(EntityDto<Guid> input)
        //{
        //    string imagePath = "E:/MyPhogGym/3.9.0/src/MyPhogGym.WebSPA1/src/app/main/home/khachHang/img/barCodes/" + input.Id.ToString() + ".png";
        //    var myBarCode = BarcodeWriter.CreateBarcode(input.Id.ToString(), BarcodeEncoding.Code128);
        //    myBarCode.AddBarcodeValueTextBelowBarcode();
        //    myBarCode.SaveAsImage(imagePath);
        //    var khachHang = await _khachHangRepository.GetAsync(input.Id);
        //    khachHang.MaVach = "app/main/home/khachHang/img/barCodes/"+ khachHang.Id.ToString() +".png";
        //    return khachHang.MaVach;
        //}
        #endregion

        #region khách hàng quẹt thẻ
        public string KhachHangQuetThe(EntityDto<Guid> input)
        {
            var khachHang = _khachHangRepository.Get(input.Id);
            return "asdsa";
            //if (khachHang != null)
            //{
            //    if (khachHang.DichVu != null)
            //    {
            //        if (DateTime.Today < khachHang.DichVu.BatDau)
            //        {
            //            return "Gói tập của bạn chưa bắt đầu";
            //        }
            //        else if (DateTime.Today > khachHang.DichVu.KetThuc)
            //        {
            //            return "Gói tập kết đã kết thúc";
            //        }

            //        switch (khachHang.DichVu.LoaiGoi)
            //        {
            //            case (int)DichVuLoaiGoi.THANG:
            //                return "Thành công";
            //            case (int)DichVuLoaiGoi.LANQUET:
            //                if (khachHang.ConLai > 0)
            //                {
            //                    return "Thành công";
            //                }
            //                return "Số lần tập đã hết";
            //            default:
            //                break;
            //        }
            //    }
            //    else
            //    {
            //        return "Bạn chưa đăng ký gói tập";
            //    }
            ////}
            //return "Thẻ hết hiệu lực";
        }
        #endregion
    }
}
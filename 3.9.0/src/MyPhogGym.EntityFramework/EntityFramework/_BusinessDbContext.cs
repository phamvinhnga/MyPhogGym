using Abp.Zero.EntityFramework;
using MyPhogGym._Business.DichVu.Entity;
using MyPhogGym._Business.HuanLuyenVien.Entity;
using MyPhogGym._Business.LichLamViec.Entity;
using MyPhogGym.Authorization.Roles;
using MyPhogGym.Authorization.Users;
using MyPhogGym.MultiTenancy;
using MyPhogGym._Business.CaLamViec.Entity;
using System.Data.Entity;
using MyPhogGym._Business.KhachHang.QuanLyKhachHang.Entity;
using MyPhogGym._Business.KhachHang.KhachHangDenTap.Entity;

namespace MyPhogGym.EntityFramework
{
    public partial class MyPhogGymDbContext : AbpZeroDbContext<Tenant, Role, User>
    {
        public virtual IDbSet<HuanLuyenVien> HuanLuyenViens { get; set; }

        public virtual IDbSet<CaLamViec> CaLamViecs { get; set; }

        public virtual IDbSet<LichLamViec> LichLamViecs { get; set; }

        public virtual IDbSet<DichVu> DichVus { get; set; }

        public virtual IDbSet<KhachHang> KhachHangs { get; set; }

        public virtual IDbSet<KhachHangDenTap> KhachHangDenTaps { get; set; }
    }
}

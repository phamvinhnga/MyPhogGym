namespace MyPhogGym.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Infrastructure.Annotations;
    using System.Data.Entity.Migrations;
    
    public partial class init_table_huanLuyenVien_caLamViec_dichVu_lichLamViec_khachHang : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CaLamViecs",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        TenCa = c.String(nullable: false),
                        BatDau = c.String(nullable: false),
                        KetThuc = c.String(nullable: false),
                        TrangThai = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeleterUserId = c.Long(),
                        DeletionTime = c.DateTime(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_CaLamViec_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AbpUsers", t => t.CreatorUserId)
                .ForeignKey("dbo.AbpUsers", t => t.DeleterUserId)
                .ForeignKey("dbo.AbpUsers", t => t.LastModifierUserId)
                .Index(t => t.DeleterUserId)
                .Index(t => t.LastModifierUserId)
                .Index(t => t.CreatorUserId);
            
            CreateTable(
                "dbo.DichVus",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        TenDichVu = c.String(nullable: false),
                        LoaiGoi = c.Int(nullable: false),
                        SoLan = c.Int(nullable: false),
                        Gia = c.Decimal(nullable: false, precision: 18, scale: 2),
                        TrangThai = c.Boolean(nullable: false),
                        BatDau = c.DateTime(),
                        KetThuc = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        DeleterUserId = c.Long(),
                        DeletionTime = c.DateTime(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_DichVu_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AbpUsers", t => t.CreatorUserId)
                .ForeignKey("dbo.AbpUsers", t => t.DeleterUserId)
                .ForeignKey("dbo.AbpUsers", t => t.LastModifierUserId)
                .Index(t => t.DeleterUserId)
                .Index(t => t.LastModifierUserId)
                .Index(t => t.CreatorUserId);
            
            CreateTable(
                "dbo.HuanLuyenViens",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        HoTen = c.String(nullable: false),
                        SDT = c.String(nullable: false),
                        DiaChi = c.String(nullable: false),
                        Email = c.String(),
                        HopDong = c.Int(nullable: false),
                        NgaySinh = c.DateTime(),
                        BatDauLam = c.DateTime(),
                        NghiViec = c.DateTime(),
                        NgayKiHopDong = c.DateTime(),
                        KetThuc = c.DateTime(),
                        Luong = c.Decimal(nullable: false, precision: 18, scale: 2),
                        TrangThai = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeleterUserId = c.Long(),
                        DeletionTime = c.DateTime(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_HuanLuyenVien_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AbpUsers", t => t.CreatorUserId)
                .ForeignKey("dbo.AbpUsers", t => t.DeleterUserId)
                .ForeignKey("dbo.AbpUsers", t => t.LastModifierUserId)
                .Index(t => t.DeleterUserId)
                .Index(t => t.LastModifierUserId)
                .Index(t => t.CreatorUserId);
            
            CreateTable(
                "dbo.LichLamViecs",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        ID_HLV = c.Guid(nullable: false),
                        TenLich = c.String(),
                        ChiTiet = c.String(),
                        IsDeleted = c.Boolean(nullable: false),
                        DeleterUserId = c.Long(),
                        DeletionTime = c.DateTime(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_LichLamViec_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AbpUsers", t => t.CreatorUserId)
                .ForeignKey("dbo.AbpUsers", t => t.DeleterUserId)
                .ForeignKey("dbo.HuanLuyenViens", t => t.ID_HLV, cascadeDelete: true)
                .ForeignKey("dbo.AbpUsers", t => t.LastModifierUserId)
                .Index(t => t.ID_HLV)
                .Index(t => t.DeleterUserId)
                .Index(t => t.LastModifierUserId)
                .Index(t => t.CreatorUserId);
            
            CreateTable(
                "dbo.KhachHangs",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        HoTen = c.String(nullable: false),
                        SDT = c.String(),
                        GioiTinh = c.Int(nullable: false),
                        NgaySinh = c.DateTime(),
                        GhiChu = c.String(),
                        DichVuID = c.Guid(),
                        DangKy = c.DateTime(),
                        TrangThai = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeleterUserId = c.Long(),
                        DeletionTime = c.DateTime(),
                        LastModificationTime = c.DateTime(),
                        LastModifierUserId = c.Long(),
                        CreationTime = c.DateTime(nullable: false),
                        CreatorUserId = c.Long(),
                    },
                annotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_KhachHang_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AbpUsers", t => t.CreatorUserId)
                .ForeignKey("dbo.AbpUsers", t => t.DeleterUserId)
                .ForeignKey("dbo.DichVus", t => t.DichVuID)
                .ForeignKey("dbo.AbpUsers", t => t.LastModifierUserId)
                .Index(t => t.DichVuID)
                .Index(t => t.DeleterUserId)
                .Index(t => t.LastModifierUserId)
                .Index(t => t.CreatorUserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.KhachHangs", "LastModifierUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.KhachHangs", "DichVuID", "dbo.DichVus");
            DropForeignKey("dbo.KhachHangs", "DeleterUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.KhachHangs", "CreatorUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.LichLamViecs", "LastModifierUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.LichLamViecs", "ID_HLV", "dbo.HuanLuyenViens");
            DropForeignKey("dbo.LichLamViecs", "DeleterUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.LichLamViecs", "CreatorUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.HuanLuyenViens", "LastModifierUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.HuanLuyenViens", "DeleterUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.HuanLuyenViens", "CreatorUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.DichVus", "LastModifierUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.DichVus", "DeleterUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.DichVus", "CreatorUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.CaLamViecs", "LastModifierUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.CaLamViecs", "DeleterUserId", "dbo.AbpUsers");
            DropForeignKey("dbo.CaLamViecs", "CreatorUserId", "dbo.AbpUsers");
            DropIndex("dbo.KhachHangs", new[] { "CreatorUserId" });
            DropIndex("dbo.KhachHangs", new[] { "LastModifierUserId" });
            DropIndex("dbo.KhachHangs", new[] { "DeleterUserId" });
            DropIndex("dbo.KhachHangs", new[] { "DichVuID" });
            DropIndex("dbo.LichLamViecs", new[] { "CreatorUserId" });
            DropIndex("dbo.LichLamViecs", new[] { "LastModifierUserId" });
            DropIndex("dbo.LichLamViecs", new[] { "DeleterUserId" });
            DropIndex("dbo.LichLamViecs", new[] { "ID_HLV" });
            DropIndex("dbo.HuanLuyenViens", new[] { "CreatorUserId" });
            DropIndex("dbo.HuanLuyenViens", new[] { "LastModifierUserId" });
            DropIndex("dbo.HuanLuyenViens", new[] { "DeleterUserId" });
            DropIndex("dbo.DichVus", new[] { "CreatorUserId" });
            DropIndex("dbo.DichVus", new[] { "LastModifierUserId" });
            DropIndex("dbo.DichVus", new[] { "DeleterUserId" });
            DropIndex("dbo.CaLamViecs", new[] { "CreatorUserId" });
            DropIndex("dbo.CaLamViecs", new[] { "LastModifierUserId" });
            DropIndex("dbo.CaLamViecs", new[] { "DeleterUserId" });
            DropTable("dbo.KhachHangs",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_KhachHang_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
            DropTable("dbo.LichLamViecs",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_LichLamViec_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
            DropTable("dbo.HuanLuyenViens",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_HuanLuyenVien_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
            DropTable("dbo.DichVus",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_DichVu_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
            DropTable("dbo.CaLamViecs",
                removedAnnotations: new Dictionary<string, object>
                {
                    { "DynamicFilter_CaLamViec_SoftDelete", "EntityFramework.DynamicFilters.DynamicFilterDefinition" },
                });
        }
    }
}

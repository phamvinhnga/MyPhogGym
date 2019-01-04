namespace MyPhogGym.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Change_DichVu_Table : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.DichVus", "BuoiTap", c => c.Int(nullable: false));
            AddColumn("dbo.DichVus", "SoLuong", c => c.Int(nullable: false));
            DropColumn("dbo.DichVus", "SoLan");
            DropColumn("dbo.DichVus", "TrangThai");
        }
        
        public override void Down()
        {
            AddColumn("dbo.DichVus", "TrangThai", c => c.Boolean(nullable: false));
            AddColumn("dbo.DichVus", "SoLan", c => c.Int(nullable: false));
            DropColumn("dbo.DichVus", "SoLuong");
            DropColumn("dbo.DichVus", "BuoiTap");
        }
    }
}

namespace MyPhogGym.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class change_table_khachHangDenTap_add_column_trangThai_soPhutConLai : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.KhachHangDenTaps", "SoPhutConlai", c => c.Int(nullable: false));
            AddColumn("dbo.KhachHangDenTaps", "TrangThai", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.KhachHangDenTaps", "TrangThai");
            DropColumn("dbo.KhachHangDenTaps", "SoPhutConlai");
        }
    }
}

namespace MyPhogGym.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class change_table_khachHang : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.KhachHangs", "LichTap", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.KhachHangs", "LichTap");
        }
    }
}

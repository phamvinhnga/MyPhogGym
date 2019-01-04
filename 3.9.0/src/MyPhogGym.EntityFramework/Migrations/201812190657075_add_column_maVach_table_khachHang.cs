namespace MyPhogGym.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class add_column_maVach_table_khachHang : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.KhachHangs", "MaVach", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.KhachHangs", "MaVach");
        }
    }
}

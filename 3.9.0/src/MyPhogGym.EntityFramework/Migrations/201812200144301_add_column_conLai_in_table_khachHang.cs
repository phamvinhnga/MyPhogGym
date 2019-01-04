namespace MyPhogGym.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class add_column_conLai_in_table_khachHang : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.KhachHangs", "ConLai", c => c.Int(nullable: true));
        }
        
        public override void Down()
        {
            DropColumn("dbo.KhachHangs", "ConLai");
        }
    }
}

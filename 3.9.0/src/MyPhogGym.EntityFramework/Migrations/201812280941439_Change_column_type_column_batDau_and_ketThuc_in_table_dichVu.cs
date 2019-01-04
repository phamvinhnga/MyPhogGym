namespace MyPhogGym.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Change_column_type_column_batDau_and_ketThuc_in_table_dichVu : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.DichVus", "BatDau", c => c.String());
            AlterColumn("dbo.DichVus", "KetThuc", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.DichVus", "KetThuc", c => c.DateTime());
            AlterColumn("dbo.DichVus", "BatDau", c => c.DateTime());
        }
    }
}

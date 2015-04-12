
drop table if exists `geo_data` ;
create table `geo_data` ( id int(11) NOT NULL AUTO_INCREMENT,
lat decimal(10,7), 
lng decimal(10,7), 
alt decimal(10,7),
message varchar (255), 
PRIMARY KEY (`id`)

) ENGINE=MYISAM CHARSET=utf8



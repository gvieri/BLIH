
drop table if exists `geo_data` ;
create table `geo_data` ( id int(11) NOT NULL AUTO_INCREMENT,
lat decimal(10,7), 
lng decimal(10,7), 
alt decimal(10,7),
message varchar (255), 
PRIMARY KEY (`id`)

) ENGINE=MYISAM CHARSET=utf8 ;

drop table if exists `users` ; 
create table `users` (
id int(11) NOT NULL AUTO_INCREMENT,
username varchar(255) not null default '', 
type int default 0, # type of user 0 for unidentified user. 
crypto_type int  default 0, # 0 for ssl 1 for gpg
public_key text not null default '' ,
PRIMARY KEY (`id`)

) ENGINE=MYISAM CHARSET=utf8 ;


drop table if exists `crypto_mode`; 

create table `crypto_mode` (
type int(11) NOT NULL , #type of crypto mode
name varchar(255) , 
external boolean default FALSE, # if the crypto utility is a php lib or an external app 
path varchar(255) , 
INDEX ind(type),
foreign key (type) 
	references users(type),
PRIMARY KEY(type)
) ENGINE=MYISAM CHARSET=utf8 ;



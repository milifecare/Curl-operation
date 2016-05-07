var mongoose = require('mongoose');
var schema = require("mongoose");
var Userschema=schema({

	id:{type:string,index:true},
	name:{type:string,index:true},
	address:{type:string},
	mobile_no:{type:string},
	education:{type:string},
	avatar:{type:string},
	create_on:{type:date,default:new Date()}
});

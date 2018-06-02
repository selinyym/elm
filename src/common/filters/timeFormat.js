
export const normalTime=(dateNum)=>{
	if(dateNum){
		var date=new Date(dateNum);
		return date.getFullYear()+"-"+fixZero(date.getMonth()+1,2)+"-"+fixZero(date.getDate(),2)+" "+fixZero(date.getHours(),2)+":"+fixZero(date.getMinutes(),2);
		function fixZero(num,length){
			var str=""+num;
			var len=str.length;
			var s="";
			for(var i=length;i-->len;){
			  s+="0";
			}
			return s+str;
		}

	}
}

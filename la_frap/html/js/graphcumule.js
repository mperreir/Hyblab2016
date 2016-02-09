function cumule(id){
	 if(id === "sub"){
            document.getElementById('finance').style.visibility = "visible";
            document.getElementById('rh').style.visibility = "hidden";
            finance();}
     else if(id === "rh"){
            document.getElementById('finance').style.visibility = "hidden";
            document.getElementById('rh').style.visibility = "visible";
            rh();}
}
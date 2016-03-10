function cumule(id){
	 if(id === "sub"){
            document.getElementById('finance').style.visibility = "visible";
            document.getElementById('rh').style.visibility = "hidden";
						document.getElementById('graphCaption').textContent = "Evolution du volume financier des subventions en moyenne par radio";
            finance();}
     else if(id === "rh"){
            document.getElementById('finance').style.visibility = "hidden";
            document.getElementById('rh').style.visibility = "visible";
						document.getElementById('graphCaption').textContent = "Evolution moyenne des effectifs par radio";
            rh();}
}

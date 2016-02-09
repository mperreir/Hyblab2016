function Map(page)
{
  this.selectionData = undefined;
  this.page = page;
  this.sidebar = page.find(".sidebar");
}

Map.prototype.update = function(event, data, button) {
  // New selection
  if (data != undefined)
    this.selectionData = data;

  if (this.selectionData != undefined) {

    if (button == 2006) {
      // this.sidebar.find(".graph").first().text(this.selectionData.value2006);
    } else if (button == 2011) {
      // this.sidebar.find(".graph").first().text(this.selectionData.value2011);
    }
    // this.sidebar.find(".graph").last().text(this.selectionData.evol);
  }
};

Map.prototype.onClick = function(data) {
  this.page.find(".sidebar").find("h1").text(data.name);
  this.update(null, data);

  if (this.page.find(".sidebar").find(".placeholder") != undefined) {
    var obj = this.page.find(".sidebar").find(".placeholder");
    obj.animate({ opacity : "-=1" }, {
      duration : 1000,
      queue : false,
      complete : function() { obj.remove(); }
    });
  }

};
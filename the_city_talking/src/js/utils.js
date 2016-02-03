let max_NO2_ = 350 ;
let pollution_classes_ = ['pollution_good','pollution_poor','pollution_terrible']
let pollution_values_ = [0,110,200,max_NO2_]
module.exports = {
    max_NO2 : max_NO2_ ,
    pollution_classes : pollution_classes_,
    pollution_values : pollution_values_,
    getPollutionCategory : function(value){
    	for (var i = 1 ; i < pollution_values_.length ; i++){
    		if (value < pollution_values_[i]){
    			return pollution_classes_[i-1];
    		}
    	}
    }
}

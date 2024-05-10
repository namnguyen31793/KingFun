
cc.Class({
    extends: require("BaseNetwork"),

    start() {

    },

    request(link, data, event) {
		cc.log(link);
		this.config_links = link;
		this.cors_url = "";
		var http = new XMLHttpRequest();
		http.open("POST", this.cors_url + this.config_links, true)
		http.setRequestHeader('Content-Type', 'application/json');
		http.setRequestHeader('client-version', cc.NetConfigNew.getInstance().CONFIG_GAME.VERSION);
		http.setRequestHeader('language', "vni");
		http.setRequestHeader('os-type', this.GetPlatFrom());;
		http.setRequestHeader('device-client-id', Global.deviceId);
		http.setRequestHeader('merchantid', cc.NetConfigNew.getInstance().CONFIG_GAME.MERCHANT);
		http.setRequestHeader('Authorization', Global.CookieValue);
        if(Global.keyMd5 != null)
            http.setRequestHeader('keymd5', Global.keyMd5);
		http.withCredentials = true;
		http.onreadystatechange = () => {//Call a function when the state changes.
		  if (http.readyState === 4 && (http.status >= 200 && http.status < 300)) {
			  
			  try{
				//cc.log(getCookie(cc.NetConfigNew.getInstance().CONFIG_GAME.COOKIENAME));
			  } catch(err) {
				  
			  }
			 
			  //Global.CookieValue = this.getCookieV2(cc.NetConfigNew.getInstance().CONFIG_GAME.COOKIENAME);
			//  cc.log("cookie:"+Global.CookiValue);*/
			  event(http.responseText);
			 // return http.responseText;
			//this.reviceConfig(http.responseText);
		  }
		}
		
		http.send(JSON.stringify(data));
		var self = this;
		http.onerror = function () {
		  setTimeout(() => {
			self.request(link, data, event);
		  }, 500)
		}
	  },

	  requestGet(link, data, event) {
		  cc.log(link);
		  this.config_links = link;
		  this.cors_url = "";
		  var http = new XMLHttpRequest();
		  http.open("GET", this.cors_url + this.config_links, true);
		  http.setRequestHeader('Content-Type', 'application/json');
		  http.setRequestHeader('client-version', cc.NetConfigNew.getInstance().CONFIG_GAME.VERSION);
		  http.setRequestHeader('language', "vni");
		  http.setRequestHeader('os-type', this.GetPlatFrom());;
		  http.setRequestHeader('device-client-id', Global.deviceId);
		  http.setRequestHeader('merchantid', cc.NetConfigNew.getInstance().CONFIG_GAME.MERCHANT);
		  http.setRequestHeader('Authorization', Global.CookieValue);
          if(Global.keyMd5 != null)
            http.setRequestHeader('keymd5', Global.keyMd5);
		  http.withCredentials = true;
		  http.onreadystatechange = () => {//Call a function when the state changes.
			if (http.readyState === 4 && (http.status >= 200 && http.status < 300)) {
				
				try{
				  //  cc.log(cc.sys.localstorge);
				  //cc.log(getCookie(cc.NetConfigNew.getInstance().CONFIG_GAME.COOKIENAME));
				} catch(err) {
					
				}
			   
				//Global.CookieValue = this.getCookieV2(cc.NetConfigNew.getInstance().CONFIG_GAME.COOKIENAME);
			  //  cc.log("cookie:"+Global.CookiValue);*/
				event(http.responseText);
			   // return http.responseText;
			  //this.reviceConfig(http.responseText);
			}
		  }
		  
		  http.send(JSON.stringify(data));
		  var self = this;
		  http.onerror = function () {
			setTimeout(() => {
			  self.requestGet(link, data, event);
			}, 500)
		  }
		},
});

(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{"0ZNv":function(n,l,t){"use strict";t.r(l);var e=t("CcnG"),o=t("EnSQ"),i=function(){function n(n,l){this.http=n,this.dataService=l,this.storageDirectory="";var t=localStorage.getItem("dirData");t&&(this.dirData=JSON.parse(t))}return n.prototype.ngOnInit=function(){this.getDirs()},n.prototype.addRow=function(){this.dirData.push("new")},n.prototype.trackByFn=function(n,l){return n},n.prototype.removeVideo=function(n){console.log("deleting "+n),this.dirData=this.dirData.filter((function(l){return l!==n}))},n.prototype.getDirs=function(){var n=this,l=this.dataService.getConfigData();this.http.get("http://"+l.IPAddress+":"+l.NodePort+"/videos/dir").subscribe((function(l){localStorage.setItem("dirData",JSON.stringify(l.data)),n.dirData=l.data}))},n}(),u=function(){return function(){}}(),a=t("pMnS"),r=t("ZYCi"),c=t("ZZ/e"),s=t("Ip0R"),b=t("oBZk"),d=t("mrSG"),p=function(){function n(n,l,t){this.http=n,this.dataService=l,this.alertController=t,this.deleteEvent=new e.m}return n.prototype.getVideoPath=function(){return"/local-stream/"+this.data},n.prototype.getThumbnail=function(){var n=this.dataService.getConfigData();return"http://"+n.IPAddress+":"+n.NodePort+"/videos/thumbnail/"+this.data.substr(0,this.data.lastIndexOf("."))+".jpg"},n.prototype.getDate=function(){var n=this.data.substr(0,this.data.indexOf("-")).split("_");return n[0]+" "+parseInt(n[1])+", "+n[2]},n.prototype.getTime=function(){var n=this.data.substr(0,this.data.lastIndexOf(".")),l=n.indexOf("-")+1,t=n.substr(l,n.length).split(".");return t[0]+":"+t[1]+":"+t[2]+" "+t[3]},n.prototype.deleteFile=function(){var n=this.dataService.getConfigData(),l="http://"+n.IPAddress+":"+n.NodePort+"/videos/delete/"+this.data.substr(0,this.data.lastIndexOf("."));this.deleteEvent.emit(this.data),this.http.get(l).subscribe()},n.prototype.downloadPress=function(){var n=this.dataService.getConfigData(),l=n.IPAddress,t=n.NodePort,e=this.data.substr(0,this.data.lastIndexOf("."));window.location.href="http://"+l+":"+t+"/videos/download/"+e+".mp4"},n.prototype.deleteAlertConfirm=function(){return d.b(this,void 0,void 0,(function(){var n=this;return d.e(this,(function(l){switch(l.label){case 0:return[4,this.alertController.create({header:"Warning",message:"Video will be deleted. Are you sure?",buttons:[{text:"Cancel",role:"cancel",cssClass:"secondary"},{text:"Delete",handler:function(){n.deleteFile()}}]})];case 1:return[4,l.sent().present()];case 2:return l.sent(),[2]}}))}))},n}(),h=t("t/Na"),f=e.rb({encapsulation:0,styles:[["ion-thumbnail[_ngcontent-%COMP%]{min-width:90px;min-height:90px}.container[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;align-content:center;-webkit-box-pack:start;justify-content:flex-start;height:auto;width:100%}.image-container[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;align-content:center;-webkit-box-pack:start;justify-content:flex-start;height:100%;width:100%}.container[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{padding-left:8px}.label-container[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;-webkit-box-pack:start;justify-content:flex-start;align-content:flex-start;width:100%}.title[_ngcontent-%COMP%]{font-size:18px;font-weight:700}.sub-title[_ngcontent-%COMP%]{font-size:17px;color:#979696}.iconContainer[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:30px;margin-bottom:2px}.iconContainer[_ngcontent-%COMP%]{display:-webkit-box;display:flex;position:relative;-webkit-box-pack:end;justify-content:flex-end;align-content:flex-end}.dropdown-content[_ngcontent-%COMP%]{display:none;position:absolute;right:0;top:30px;background-color:#f1f1f1;min-width:160px;box-shadow:0 8px 16px 0 rgba(0,0,0,.2);z-index:6}.dropdown-content[_ngcontent-%COMP%]   .menu-label[_ngcontent-%COMP%]{color:#000;padding:12px 16px;min-height:35px;text-decoration:none;width:100%;position:relative}.menu-label[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{padding-top:0;margin:0;font-size:20px;position:absolute;bottom:8px}.menu-label[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{font-size:16px;position:absolute;bottom:8px;left:40px}.dropdown-content[_ngcontent-%COMP%]   .menu-label[_ngcontent-%COMP%]:hover{background-color:#ddd}.iconContainer[_ngcontent-%COMP%]:hover   .dropdown-content[_ngcontent-%COMP%]{display:block}.iconContainer[_ngcontent-%COMP%]:hover   .icon[_ngcontent-%COMP%]{background-color:#a3a3a3}"]],data:{}});function g(n){return e.Kb(0,[(n()(),e.tb(0,0,null,null,30,"div",[["class","container"]],null,null,null,null,null)),(n()(),e.tb(1,0,null,null,13,"div",[["class","image-container"],["routerDirection","forward"]],null,[[null,"click"]],(function(n,l,t){var o=!0;return"click"===l&&(o=!1!==e.Fb(n,2).onClick()&&o),"click"===l&&(o=!1!==e.Fb(n,3).onClick(t)&&o),o}),null,null)),e.sb(2,16384,null,0,r.n,[r.m,r.a,[8,null],e.D,e.k],{routerLink:[0,"routerLink"]},null),e.sb(3,737280,null,0,c.Kb,[s.g,c.Hb,e.k,r.m,[2,r.n]],{routerDirection:[0,"routerDirection"]},null),(n()(),e.tb(4,0,null,null,3,"ion-thumbnail",[],null,null,null,b.P,b.s)),e.sb(5,49152,null,0,c.zb,[e.h,e.k,e.z],null,null),(n()(),e.tb(6,0,null,0,1,"ion-img",[],null,null,null,b.G,b.j)),e.sb(7,49152,null,0,c.D,[e.h,e.k,e.z],{src:[0,"src"]},null),(n()(),e.tb(8,0,null,null,6,"div",[["class","label-container"]],null,null,null,null,null)),(n()(),e.tb(9,0,null,null,2,"ion-label",[["class","title"]],null,null,null,b.J,b.m)),e.sb(10,49152,null,0,c.N,[e.h,e.k,e.z],null,null),(n()(),e.Jb(11,0,[" "," "])),(n()(),e.tb(12,0,null,null,2,"ion-label",[["class","sub-title"]],null,null,null,b.J,b.m)),e.sb(13,49152,null,0,c.N,[e.h,e.k,e.z],null,null),(n()(),e.Jb(14,0,[" "," "])),(n()(),e.tb(15,0,null,null,15,"div",[["class","iconContainer"]],null,null,null,null,null)),(n()(),e.tb(16,0,null,null,1,"ion-icon",[["class","icon"],["name","more"],["on",""]],null,null,null,b.F,b.i)),e.sb(17,49152,null,0,c.C,[e.h,e.k,e.z],{name:[0,"name"]},null),(n()(),e.tb(18,0,null,null,12,"div",[["class","dropdown-content"],["id","dropdown"]],null,null,null,null,null)),(n()(),e.tb(19,0,null,null,5,"div",[["class","menu-label"]],null,[[null,"click"]],(function(n,l,t){var e=!0;return"click"===l&&(e=!1!==n.component.downloadPress()&&e),e}),null,null)),(n()(),e.tb(20,0,null,null,1,"ion-icon",[["name","md-download"]],null,null,null,b.F,b.i)),e.sb(21,49152,null,0,c.C,[e.h,e.k,e.z],{name:[0,"name"]},null),(n()(),e.tb(22,0,null,null,2,"ion-label",[],null,null,null,b.J,b.m)),e.sb(23,49152,null,0,c.N,[e.h,e.k,e.z],null,null),(n()(),e.Jb(-1,0,["Download"])),(n()(),e.tb(25,0,null,null,5,"div",[["class","menu-label"]],null,[[null,"click"]],(function(n,l,t){var e=!0;return"click"===l&&(e=!1!==n.component.deleteAlertConfirm()&&e),e}),null,null)),(n()(),e.tb(26,0,null,null,1,"ion-icon",[["name","ios-trash"]],null,null,null,b.F,b.i)),e.sb(27,49152,null,0,c.C,[e.h,e.k,e.z],{name:[0,"name"]},null),(n()(),e.tb(28,0,null,null,2,"ion-label",[],null,null,null,b.J,b.m)),e.sb(29,49152,null,0,c.N,[e.h,e.k,e.z],null,null),(n()(),e.Jb(-1,0,["Delete"]))],(function(n,l){var t=l.component;n(l,2,0,e.xb(1,"",t.getVideoPath(),"")),n(l,3,0,"forward"),n(l,7,0,t.getThumbnail()),n(l,17,0,"more"),n(l,21,0,"md-download"),n(l,27,0,"ios-trash")}),(function(n,l){var t=l.component;n(l,11,0,t.getDate()),n(l,14,0,t.getTime())}))}function m(n){return e.Kb(0,[(n()(),e.tb(0,0,null,null,1,"app-input-row",[],null,null,null,g,f)),e.sb(1,49152,null,0,p,[h.c,o.a,c.a],null,null)],null,null)}var x=e.pb("app-input-row",p,m,{data:"data"},{deleteEvent:"deleteEvent"},[]),k=e.rb({encapsulation:0,styles:[["ion-title[_ngcontent-%COMP%]{position:absolute;top:0;left:0;padding:0 90px 1px;width:100%;height:100%;text-align:ion-text-center}.page-title[_ngcontent-%COMP%]{font-size:20px;color:#fff}ion-content[_ngcontent-%COMP%]{--ion-background-color:#ebe4e4;height:100vh;width:100vw}.image[_ngcontent-%COMP%]{background-color:#fff;padding:10px;margin-top:15px;margin-bottom:15px}ion-back-button[_ngcontent-%COMP%]{color:#fdfdfd}.header[_ngcontent-%COMP%]{--ion-color-primary:#353d55;--border-color:#797979;--border-width:1px}"]],data:{}});function v(n){return e.Kb(0,[(n()(),e.tb(0,0,null,null,2,"div",[["class","image"],["style","font-size:smaller"]],null,null,null,null,null)),(n()(),e.tb(1,0,null,null,1,"app-input-row",[],null,[[null,"deleteEvent"]],(function(n,l,t){var e=!0;return"deleteEvent"===l&&(e=!1!==n.component.removeVideo(t)&&e),e}),g,f)),e.sb(2,49152,null,0,p,[h.c,o.a,c.a],{data:[0,"data"]},{deleteEvent:"deleteEvent"})],(function(n,l){n(l,2,0,l.context.$implicit)}),null)}function w(n){return e.Kb(0,[(n()(),e.tb(0,0,null,null,11,"ion-header",[],null,null,null,b.E,b.h)),e.sb(1,49152,null,0,c.B,[e.h,e.k,e.z],null,null),(n()(),e.tb(2,0,null,0,9,"ion-toolbar",[["class","header"],["color","primary"],["mode","ios"]],null,null,null,b.S,b.v)),e.sb(3,49152,null,0,c.Cb,[e.h,e.k,e.z],{color:[0,"color"],mode:[1,"mode"]},null),(n()(),e.tb(4,0,null,0,4,"ion-buttons",[["slot","start"]],null,null,null,b.A,b.d)),e.sb(5,49152,null,0,c.l,[e.h,e.k,e.z],null,null),(n()(),e.tb(6,0,null,0,2,"ion-back-button",[["defaultHref","/home"]],null,[[null,"click"]],(function(n,l,t){var o=!0;return"click"===l&&(o=!1!==e.Fb(n,8).onClick(t)&&o),o}),b.y,b.b)),e.sb(7,49152,null,0,c.g,[e.h,e.k,e.z],{defaultHref:[0,"defaultHref"]},null),e.sb(8,16384,null,0,c.h,[[2,c.ib],c.Hb],{defaultHref:[0,"defaultHref"]},null),(n()(),e.tb(9,0,null,0,2,"ion-title",[["class","ion-text-center page-title"]],null,null,null,b.Q,b.t)),e.sb(10,49152,null,0,c.Ab,[e.h,e.k,e.z],null,null),(n()(),e.Jb(-1,0,["Video Library"])),(n()(),e.tb(12,0,null,null,8,"ion-content",[],null,null,null,b.C,b.f)),e.sb(13,49152,null,0,c.u,[e.h,e.k,e.z],null,null),(n()(),e.tb(14,0,null,0,6,"ion-virtual-scroll",[["approxItemHeight","100px"]],null,null,null,b.T,b.w)),e.sb(15,835584,null,3,c.Db,[e.z,e.s,e.k],{approxItemHeight:[0,"approxItemHeight"],items:[1,"items"]},null),e.Hb(335544320,1,{itmTmp:0}),e.Hb(335544320,2,{hdrTmp:0}),e.Hb(335544320,3,{ftrTmp:0}),(n()(),e.ib(16777216,null,0,1,null,v)),e.sb(20,16384,[[1,4]],0,c.Nb,[e.L,e.O],null,null)],(function(n,l){var t=l.component;n(l,3,0,"primary","ios"),n(l,7,0,"/home"),n(l,8,0,"/home"),n(l,15,0,"100px",t.dirData)}),null)}function C(n){return e.Kb(0,[(n()(),e.tb(0,0,null,null,1,"app-video-list",[],null,null,null,w,k)),e.sb(1,114688,null,0,i,[h.c,o.a],null,null)],(function(n,l){n(l,1,0)}),null)}var P=e.pb("app-video-list",i,C,{},{},[]),y=t("gIcY");t.d(l,"VideoListPageModuleNgFactory",(function(){return O}));var O=e.qb(u,[],(function(n){return e.Cb([e.Db(512,e.j,e.bb,[[8,[a.a,P,x]],[3,e.j],e.x]),e.Db(4608,s.k,s.j,[e.u,[2,s.q]]),e.Db(4608,y.g,y.g,[]),e.Db(4608,c.b,c.b,[e.z,e.g]),e.Db(4608,c.Gb,c.Gb,[c.b,e.j,e.q]),e.Db(4608,c.Jb,c.Jb,[c.b,e.j,e.q]),e.Db(1073742336,s.b,s.b,[]),e.Db(1073742336,y.f,y.f,[]),e.Db(1073742336,y.a,y.a,[]),e.Db(1073742336,c.Eb,c.Eb,[]),e.Db(1073742336,r.o,r.o,[[2,r.t],[2,r.m]]),e.Db(1073742336,u,u,[]),e.Db(1024,r.k,(function(){return[[{path:"",component:i}]]}),[])])}))}}]);
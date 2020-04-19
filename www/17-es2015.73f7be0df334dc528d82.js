(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{"0ZNv":function(n,l,t){"use strict";t.r(l);var e=t("8Y7J"),o=t("EnSQ");class i{constructor(n,l){this.http=n,this.dataService=l,this.storageDirectory="";const t=localStorage.getItem("dirData");t&&(this.dirData=JSON.parse(t))}ngOnInit(){this.getDirs()}addRow(){this.dirData.push("new")}trackByFn(n,l){return n}removeVideo(n){console.log("deleting "+n),this.dirData=this.dirData.filter(l=>l!==n)}getDirs(){const{IPAddress:n,NodePort:l}=this.dataService.getConfigData();this.http.get(`http://${n}:${l}/videos/dir`).subscribe(n=>{localStorage.setItem("dirData",JSON.stringify(n.data)),this.dirData=n.data})}}class u{}var a=t("pMnS"),r=t("iInd"),c=t("ZZ/e"),s=t("SVse"),d=t("oBZk"),b=t("mrSG");class p{constructor(n,l,t){this.http=n,this.dataService=l,this.alertController=t,this.deleteEvent=new e.m}getVideoPath(){return"/local-stream/"+this.data}getThumbnail(){const{IPAddress:n,NodePort:l}=this.dataService.getConfigData();return`http://${n}:${l}/videos/thumbnail/${this.data.substr(0,this.data.lastIndexOf("."))}.jpg`}getDate(){const n=this.data.substr(0,this.data.indexOf("-")).split("_");return`${n[0]} ${parseInt(n[1])}, ${n[2]}`}getTime(){const n=this.data.substr(0,this.data.lastIndexOf(".")),l=n.indexOf("-")+1,t=n.substr(l,n.length).split(".");return`${t[0]}:${t[1]}:${t[2]} ${t[3]}`}deleteFile(){const{IPAddress:n,NodePort:l}=this.dataService.getConfigData(),t=`http://${n}:${l}/videos/delete/${this.data.substr(0,this.data.lastIndexOf("."))}`;this.deleteEvent.emit(this.data),this.http.get(t).subscribe()}downloadPress(){const{IPAddress:n,NodePort:l}=this.dataService.getConfigData(),t=this.data.substr(0,this.data.lastIndexOf("."));window.location.href=`http://${n}:${l}/videos/download/${t}.mp4`}deleteAlertConfirm(){return b.b(this,void 0,void 0,(function*(){const n=yield this.alertController.create({header:"Warning",message:"Video will be deleted. Are you sure?",buttons:[{text:"Cancel",role:"cancel",cssClass:"secondary"},{text:"Delete",handler:()=>{this.deleteFile()}}]});yield n.present()}))}}var h=t("IheW"),g=e.pb({encapsulation:0,styles:[["ion-thumbnail[_ngcontent-%COMP%]{min-width:90px;min-height:90px}.container[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;align-content:center;-webkit-box-pack:start;justify-content:flex-start;height:auto;width:100%}.image-container[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;flex-direction:row;align-content:center;-webkit-box-pack:start;justify-content:flex-start;height:100%;width:100%}.container[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{padding-left:8px}.label-container[_ngcontent-%COMP%]{display:-webkit-box;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;-webkit-box-pack:start;justify-content:flex-start;align-content:flex-start;width:100%}.title[_ngcontent-%COMP%]{font-size:18px;font-weight:700}.sub-title[_ngcontent-%COMP%]{font-size:17px;color:#979696}.iconContainer[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:30px;margin-bottom:2px}.iconContainer[_ngcontent-%COMP%]{display:-webkit-box;display:flex;position:relative;-webkit-box-pack:end;justify-content:flex-end;align-content:flex-end}.dropdown-content[_ngcontent-%COMP%]{display:none;position:absolute;right:0;top:30px;background-color:#f1f1f1;min-width:160px;box-shadow:0 8px 16px 0 rgba(0,0,0,.2);z-index:6}.dropdown-content[_ngcontent-%COMP%]   .menu-label[_ngcontent-%COMP%]{color:#000;padding:12px 16px;min-height:35px;text-decoration:none;width:100%;position:relative}.menu-label[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{padding-top:0;margin:0;font-size:20px;position:absolute;bottom:8px}.menu-label[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]{font-size:16px;position:absolute;bottom:8px;left:40px}.dropdown-content[_ngcontent-%COMP%]   .menu-label[_ngcontent-%COMP%]:hover{background-color:#ddd}.iconContainer[_ngcontent-%COMP%]:hover   .dropdown-content[_ngcontent-%COMP%]{display:block}.iconContainer[_ngcontent-%COMP%]:hover   .icon[_ngcontent-%COMP%]{background-color:#a3a3a3}"]],data:{}});function m(n){return e.Ib(0,[(n()(),e.rb(0,0,null,null,30,"div",[["class","container"]],null,null,null,null,null)),(n()(),e.rb(1,0,null,null,13,"div",[["class","image-container"],["routerDirection","forward"]],null,[[null,"click"]],(function(n,l,t){var o=!0;return"click"===l&&(o=!1!==e.Db(n,2).onClick()&&o),"click"===l&&(o=!1!==e.Db(n,3).onClick(t)&&o),o}),null,null)),e.qb(2,16384,null,0,r.n,[r.m,r.a,[8,null],e.B,e.k],{routerLink:[0,"routerLink"]},null),e.qb(3,737280,null,0,c.Kb,[s.g,c.Hb,e.k,r.m,[2,r.n]],{routerDirection:[0,"routerDirection"]},null),(n()(),e.rb(4,0,null,null,3,"ion-thumbnail",[],null,null,null,d.P,d.s)),e.qb(5,49152,null,0,c.zb,[e.h,e.k,e.x],null,null),(n()(),e.rb(6,0,null,0,1,"ion-img",[],null,null,null,d.G,d.j)),e.qb(7,49152,null,0,c.D,[e.h,e.k,e.x],{src:[0,"src"]},null),(n()(),e.rb(8,0,null,null,6,"div",[["class","label-container"]],null,null,null,null,null)),(n()(),e.rb(9,0,null,null,2,"ion-label",[["class","title"]],null,null,null,d.J,d.m)),e.qb(10,49152,null,0,c.N,[e.h,e.k,e.x],null,null),(n()(),e.Hb(11,0,[" "," "])),(n()(),e.rb(12,0,null,null,2,"ion-label",[["class","sub-title"]],null,null,null,d.J,d.m)),e.qb(13,49152,null,0,c.N,[e.h,e.k,e.x],null,null),(n()(),e.Hb(14,0,[" "," "])),(n()(),e.rb(15,0,null,null,15,"div",[["class","iconContainer"]],null,null,null,null,null)),(n()(),e.rb(16,0,null,null,1,"ion-icon",[["class","icon"],["name","more"],["on",""]],null,null,null,d.F,d.i)),e.qb(17,49152,null,0,c.C,[e.h,e.k,e.x],{name:[0,"name"]},null),(n()(),e.rb(18,0,null,null,12,"div",[["class","dropdown-content"],["id","dropdown"]],null,null,null,null,null)),(n()(),e.rb(19,0,null,null,5,"div",[["class","menu-label"]],null,[[null,"click"]],(function(n,l,t){var e=!0;return"click"===l&&(e=!1!==n.component.downloadPress()&&e),e}),null,null)),(n()(),e.rb(20,0,null,null,1,"ion-icon",[["name","md-download"]],null,null,null,d.F,d.i)),e.qb(21,49152,null,0,c.C,[e.h,e.k,e.x],{name:[0,"name"]},null),(n()(),e.rb(22,0,null,null,2,"ion-label",[],null,null,null,d.J,d.m)),e.qb(23,49152,null,0,c.N,[e.h,e.k,e.x],null,null),(n()(),e.Hb(-1,0,["Download"])),(n()(),e.rb(25,0,null,null,5,"div",[["class","menu-label"]],null,[[null,"click"]],(function(n,l,t){var e=!0;return"click"===l&&(e=!1!==n.component.deleteAlertConfirm()&&e),e}),null,null)),(n()(),e.rb(26,0,null,null,1,"ion-icon",[["name","ios-trash"]],null,null,null,d.F,d.i)),e.qb(27,49152,null,0,c.C,[e.h,e.k,e.x],{name:[0,"name"]},null),(n()(),e.rb(28,0,null,null,2,"ion-label",[],null,null,null,d.J,d.m)),e.qb(29,49152,null,0,c.N,[e.h,e.k,e.x],null,null),(n()(),e.Hb(-1,0,["Delete"]))],(function(n,l){var t=l.component;n(l,2,0,e.vb(1,"",t.getVideoPath(),"")),n(l,3,0,"forward"),n(l,7,0,t.getThumbnail()),n(l,17,0,"more"),n(l,21,0,"md-download"),n(l,27,0,"ios-trash")}),(function(n,l){var t=l.component;n(l,11,0,t.getDate()),n(l,14,0,t.getTime())}))}function f(n){return e.Ib(0,[(n()(),e.rb(0,0,null,null,1,"app-input-row",[],null,null,null,m,g)),e.qb(1,49152,null,0,p,[h.c,o.a,c.a],null,null)],null,null)}var x=e.nb("app-input-row",p,f,{data:"data"},{deleteEvent:"deleteEvent"},[]),k=e.pb({encapsulation:0,styles:[["ion-title[_ngcontent-%COMP%]{position:absolute;top:0;left:0;padding:0 90px 1px;width:100%;height:100%;text-align:ion-text-center}.page-title[_ngcontent-%COMP%]{font-size:20px;color:#fff}ion-content[_ngcontent-%COMP%]{--ion-background-color:#ebe4e4;height:100vh;width:100vw}.image[_ngcontent-%COMP%]{background-color:#fff;padding:10px;margin-top:15px;margin-bottom:15px}ion-back-button[_ngcontent-%COMP%]{color:#fdfdfd}.header[_ngcontent-%COMP%]{--ion-color-primary:#353d55;--border-color:#797979;--border-width:1px}"]],data:{}});function v(n){return e.Ib(0,[(n()(),e.rb(0,0,null,null,2,"div",[["class","image"],["style","font-size:smaller"]],null,null,null,null,null)),(n()(),e.rb(1,0,null,null,1,"app-input-row",[],null,[[null,"deleteEvent"]],(function(n,l,t){var e=!0;return"deleteEvent"===l&&(e=!1!==n.component.removeVideo(t)&&e),e}),m,g)),e.qb(2,49152,null,0,p,[h.c,o.a,c.a],{data:[0,"data"]},{deleteEvent:"deleteEvent"})],(function(n,l){n(l,2,0,l.context.$implicit)}),null)}function w(n){return e.Ib(0,[(n()(),e.rb(0,0,null,null,11,"ion-header",[],null,null,null,d.E,d.h)),e.qb(1,49152,null,0,c.B,[e.h,e.k,e.x],null,null),(n()(),e.rb(2,0,null,0,9,"ion-toolbar",[["class","header"],["color","primary"],["mode","ios"]],null,null,null,d.S,d.v)),e.qb(3,49152,null,0,c.Cb,[e.h,e.k,e.x],{color:[0,"color"],mode:[1,"mode"]},null),(n()(),e.rb(4,0,null,0,4,"ion-buttons",[["slot","start"]],null,null,null,d.A,d.d)),e.qb(5,49152,null,0,c.l,[e.h,e.k,e.x],null,null),(n()(),e.rb(6,0,null,0,2,"ion-back-button",[["defaultHref","/home"]],null,[[null,"click"]],(function(n,l,t){var o=!0;return"click"===l&&(o=!1!==e.Db(n,8).onClick(t)&&o),o}),d.y,d.b)),e.qb(7,49152,null,0,c.g,[e.h,e.k,e.x],{defaultHref:[0,"defaultHref"]},null),e.qb(8,16384,null,0,c.h,[[2,c.ib],c.Hb],{defaultHref:[0,"defaultHref"]},null),(n()(),e.rb(9,0,null,0,2,"ion-title",[["class","ion-text-center page-title"]],null,null,null,d.Q,d.t)),e.qb(10,49152,null,0,c.Ab,[e.h,e.k,e.x],null,null),(n()(),e.Hb(-1,0,["Video Library"])),(n()(),e.rb(12,0,null,null,8,"ion-content",[],null,null,null,d.C,d.f)),e.qb(13,49152,null,0,c.u,[e.h,e.k,e.x],null,null),(n()(),e.rb(14,0,null,0,6,"ion-virtual-scroll",[["approxItemHeight","100px"]],null,null,null,d.T,d.w)),e.qb(15,835584,null,3,c.Db,[e.x,e.q,e.k],{approxItemHeight:[0,"approxItemHeight"],items:[1,"items"]},null),e.Fb(335544320,1,{itmTmp:0}),e.Fb(335544320,2,{hdrTmp:0}),e.Fb(335544320,3,{ftrTmp:0}),(n()(),e.gb(16777216,null,0,1,null,v)),e.qb(20,16384,[[1,4]],0,c.Nb,[e.J,e.M],null,null)],(function(n,l){var t=l.component;n(l,3,0,"primary","ios"),n(l,7,0,"/home"),n(l,8,0,"/home"),n(l,15,0,"100px",t.dirData)}),null)}function C(n){return e.Ib(0,[(n()(),e.rb(0,0,null,null,1,"app-video-list",[],null,null,null,w,k)),e.qb(1,114688,null,0,i,[h.c,o.a],null,null)],(function(n,l){n(l,1,0)}),null)}var P=e.nb("app-video-list",i,C,{},{},[]),O=t("s7LF");t.d(l,"VideoListPageModuleNgFactory",(function(){return M}));var M=e.ob(u,[],(function(n){return e.Ab([e.Bb(512,e.j,e.Z,[[8,[a.a,P,x]],[3,e.j],e.v]),e.Bb(4608,s.k,s.j,[e.s,[2,s.q]]),e.Bb(4608,O.g,O.g,[]),e.Bb(4608,c.b,c.b,[e.x,e.g]),e.Bb(4608,c.Gb,c.Gb,[c.b,e.j,e.p]),e.Bb(4608,c.Jb,c.Jb,[c.b,e.j,e.p]),e.Bb(1073742336,s.b,s.b,[]),e.Bb(1073742336,O.f,O.f,[]),e.Bb(1073742336,O.a,O.a,[]),e.Bb(1073742336,c.Eb,c.Eb,[]),e.Bb(1073742336,r.o,r.o,[[2,r.t],[2,r.m]]),e.Bb(1073742336,u,u,[]),e.Bb(1024,r.k,(function(){return[[{path:"",component:i}]]}),[])])}))}}]);
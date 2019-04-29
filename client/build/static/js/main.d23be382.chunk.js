(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{136:function(e,t,a){e.exports=a.p+"static/media/welcome.408a8c1c.png"},160:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(32),l=a.n(r),c=(a(83),a(3)),o=a(4),s=a(6),m=a(5),u=a(7),d=a(18),h=a(35),p=a(43),E=a.n(p),g=(a(86),a(39)),f=a(30),v=a(10),y=function(e){function t(){return Object(c.a)(this,t),Object(s.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(o.a)(t,[{key:"logout",value:function(){window.confirm("Would you like to log out of PV3?")&&(window.localStorage.removeItem("token"),window.location="/")}},{key:"render",value:function(){var e=this;return i.a.createElement("header",null,i.a.createElement("div",null,i.a.createElement(d.b,{to:"/"},i.a.createElement("img",{src:a(95),style:{width:150},alt:"PV3"}))),this.props.decoded?i.a.createElement("div",{className:"navigation"},i.a.createElement(d.b,{to:"/dashboard"},"Dashboard"),i.a.createElement(d.b,{to:"/sales"},"Sales"),i.a.createElement(d.b,{to:"/customers"},"Customers"),i.a.createElement(d.b,{to:"/profile"},"Public Profile"),i.a.createElement(d.b,{to:"/account"},i.a.createElement(v.a,{icon:"user"}),"My Account"),i.a.createElement(d.b,{to:"/",onClick:this.logout},i.a.createElement(v.a,{icon:"sign-out-alt"}),"Sign out")):i.a.createElement("div",null,this.props.login?i.a.createElement("div",{className:"link",onClick:function(){return e.props.setState({login:!1})}},"Register"):i.a.createElement("div",{className:"link",onClick:function(){return e.props.setState({login:!0})}},"Sign In")))}}]),t}(n.Component),b=a(21),C=a(15),k=a.n(C),O=a(20),j=a.n(O),w=a(9),N=a.n(w),P=a(13),A=a.n(P),S=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).handleChange=function(e){a.props.setState(Object(b.a)({},e.target.name,e.target.value))},a.onImageChange=function(e){var t=e.target.files[0];a.props.setState({image:URL.createObjectURL(t),file:t,fileName:t.name,fileType:t.type})},a.state={firstName:""},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"verifyPhone",value:function(){var e=this;j.a.post("api/auth/send?phone="+this.props.state.phone).then(function(t){console.log(t),e.props.setState({verifyCode:t.data.verifyCode,view:"VerifyAccount"})}).catch(function(e){console.error(e)})}},{key:"render",value:function(){var e=this;return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",{className:"center"},i.a.createElement("h2",null,"Create Account"),i.a.createElement("br",null),i.a.createElement(A.a,null,i.a.createElement(A.a.Group,null,i.a.createElement("input",{type:"file",name:"imgFile",ref:function(t){return e.upload=t},onChange:this.onImageChange,style:{display:"none"}}),i.a.createElement("div",{className:"profilePic"},this.props.state.image?i.a.createElement("img",{src:this.props.state.image,style:{width:75,height:75,borderRadius:"50%",objectFit:"cover"},alt:""}):i.a.createElement(v.a,{icon:"plus",size:"2x",style:{opacity:.2},onClick:function(){e.upload.click()}}))),i.a.createElement(A.a.Group,null,i.a.createElement(A.a.Control,{placeholder:"First Name",name:"firstName",onChange:this.handleChange})),i.a.createElement(A.a.Group,null,i.a.createElement(A.a.Control,{placeholder:"Last Name",name:"lastName",onChange:this.handleChange})),i.a.createElement(A.a.Group,null,i.a.createElement(A.a.Control,{placeholder:"Email Address",name:"email",onChange:this.handleChange})),i.a.createElement(A.a.Group,null,i.a.createElement(A.a.Control,{placeholder:"Phone Number",name:"phone",onChange:this.handleChange})),i.a.createElement(A.a.Group,null,i.a.createElement(A.a.Check,{type:"checkbox",label:"Remember me"}))),i.a.createElement(N.a,{variant:"success",size:"lg",onClick:this.verifyPhone.bind(this)},"Continue")))}}]),t}(n.Component),x=a(22),W=a.n(x),X=a(24),G=a.n(X),V=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).handleChange=function(e){a.setState(Object(b.a)({},e.target.name,e.target.value))},a.state={code:""},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"verifyAccount",value:function(){this.state.code===JSON.stringify(this.props.state.verifyCode)?this.props.setState({view:"ProfileSummary"}):window.alert("Verification code is invalid. Please try again.")}},{key:"render",value:function(){return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",{className:"center"},i.a.createElement("h3",null,"Verify Your Account"),i.a.createElement(G.a,null,i.a.createElement(W.a,{className:"verificationInput",placeholder:"0000",name:"code",onChange:this.handleChange})),i.a.createElement("p",null,"We sent a 4 digit confirmation code to",i.a.createElement("br",null),this.props.state.phone,i.a.createElement("br",null),"You should get it in a few seconds"),i.a.createElement(N.a,{variant:"success",size:"lg",onClick:this.verifyAccount.bind(this)},"Continue")))}}]),t}(n.Component),J=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(i)))).handleChange=function(e){a.props.setState(Object(b.a)({},e.target.name,e.target.value))},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this;return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",{className:"center"},i.a.createElement("h3",null,"Create a profile summary"),i.a.createElement(A.a,null,i.a.createElement(A.a.Group,null,i.a.createElement(A.a.Label,null,"Content Provider Summary"),i.a.createElement(A.a.Control,{as:"textarea",rows:"4",placeholder:"I grew up in Arizona and moved to SF when I was 5...",name:"summary",onChange:this.handleChange})),i.a.createElement(A.a.Group,null,i.a.createElement(A.a.Label,null,"Add categories of content you will offer"),i.a.createElement(A.a.Control,{as:"textarea",rows:"4",placeholder:"Add a category",name:"category",onChange:this.handleChange}))),i.a.createElement(N.a,{variant:"success",size:"lg",onClick:function(){return e.props.setState({view:"SubscriptionPlan"})}},"Next")))}}]),t}(n.Component),M=a(73),I=a.n(M),q=function(e){function t(){return Object(c.a)(this,t),Object(s.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(o.a)(t,[{key:"register",value:function(){var e=this.props.state,t=new FormData;t.append("imgFile",e.file),j.a.post("api/users/register?firstName="+e.firstName+"&lastName="+e.lastName+"&email="+e.email+"&phone="+e.phone+"&summary="+e.summary,t).then(function(e){console.log(e),window.localStorage.setItem("token",e.data.token),window.location.reload()}).catch(function(e){console.error(e)})}},{key:"render",value:function(){return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",{className:"center"},i.a.createElement(I.a,{vertical:!0},i.a.createElement(N.a,{variant:"light"},i.a.createElement("h4",null,"Small Plan"),i.a.createElement("p",null,"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."),i.a.createElement("h4",null,"$0 Per Month")),i.a.createElement(N.a,{variant:"light"},i.a.createElement("h4",null,"Medium Plan"),i.a.createElement("p",null,"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."),i.a.createElement("h4",null,"$199 Per Month")),i.a.createElement(N.a,{variant:"light"},i.a.createElement("h4",null,"Pro Plan"),i.a.createElement("p",null,"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."),i.a.createElement("h4",null,"$399 Per Month"))),i.a.createElement(N.a,{variant:"success",size:"lg",onClick:this.register.bind(this)},"Register")))}}]),t}(n.Component),R=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).state={view:"CreateAccount"},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this.state.view,t={state:this.state,setState:this.setState.bind(this)};switch(e){case"CreateAccount":return i.a.createElement(S,t);case"VerifyAccount":return i.a.createElement(V,t);case"ProfileSummary":return i.a.createElement(J,t);case"SubscriptionPlan":return i.a.createElement(q,t);default:return null}}}]),t}(n.Component),T=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(i)))).handleChange=function(e){a.props.setState(Object(b.a)({},e.target.name,e.target.value))},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"verifyPhone",value:function(){var e=this;j.a.post("api/auth/verify?phone="+this.props.state.phone).then(function(t){console.log(t),!0===t.data.success?e.props.setState({verifyCode:t.data.verifyCode,view:"VerifyAccount"}):window.alert("Invalid phone number. Please try again")}).catch(function(e){console.error(e)})}},{key:"render",value:function(){return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",{className:"center"},i.a.createElement("h3",null,"Welcome Back"),i.a.createElement(G.a,null,i.a.createElement(W.a,{className:"verificationInput",placeholder:"+1 000 000 0000",name:"phone",onChange:this.handleChange})),i.a.createElement("p",null,"Please enter your phone number to sign in."),i.a.createElement(N.a,{variant:"success",size:"lg",onClick:this.verifyPhone.bind(this)},"Continue")))}}]),t}(n.Component),H=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).handleChange=function(e){a.setState(Object(b.a)({},e.target.name,e.target.value))},a.state={code:""},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"login",value:function(){console.log(this.props,this.state),this.state.code===JSON.stringify(this.props.state.verifyCode)?j.a.post("api/users/login?phone="+this.props.state.phone).then(function(e){console.log(e),window.localStorage.setItem("token",e.data.token),window.location.reload()}).catch(function(e){console.error(e)}):window.alert("Verification code is invalid. Please try again.")}},{key:"render",value:function(){return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",{className:"center"},i.a.createElement("h3",null,"Verify Your Account"),i.a.createElement(G.a,null,i.a.createElement(W.a,{className:"verificationInput",placeholder:"0000",name:"code",onChange:this.handleChange})),i.a.createElement("p",null,"We sent a 4 digit confirmation code to",i.a.createElement("br",null),this.props.state.phone,i.a.createElement("br",null),"You should get it in a few seconds"),i.a.createElement(N.a,{variant:"success",size:"lg",onClick:this.login.bind(this)},"Continue")))}}]),t}(n.Component),z=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).state={view:"Login"},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this.state.view,t={state:this.state,setState:this.setState.bind(this)};switch(e){case"Login":return i.a.createElement(T,t);case"VerifyAccount":return i.a.createElement(H,t);default:return null}}}]),t}(n.Component),L=function(e){function t(){return Object(c.a)(this,t),Object(s.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",{className:"center"},i.a.createElement("h1",null,"Welcome to PV3"),i.a.createElement("br",null),i.a.createElement("h5",null,"Congratulations, you're just a few steps away from getting paid for your content."),i.a.createElement("img",{src:a(136),style:{width:"100%",opacity:.6},alt:"Welcome"}),i.a.createElement(d.b,{to:"/pages/add"},i.a.createElement(N.a,{variant:"success",size:"lg"},"Create Your First Page"))))}}]),t}(n.Component),U=a(74),B=a.n(U),F=a(40),Z=a.n(F),D=a(75),Y=a.n(D),Q=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).state={stats:[],pages:[]},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){var e=this;j.a.get("api/pages/search").then(function(t){console.log(t),e.setState({pages:t.data.response,S3_BUCKET:t.data.bucket})}).catch(function(e){console.error(e)})}},{key:"render",value:function(){var e=this;return console.log(this.state),i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",{className:"main"},i.a.createElement("div",{className:"statistics"},i.a.createElement("div",{style:{backgroundColor:"#01ae63"}},i.a.createElement(v.a,{icon:"dollar-sign"}),i.a.createElement("div",null,"$45k"),i.a.createElement("div",null,"Recent Earnings (+50)")),i.a.createElement("div",{style:{backgroundColor:"#e0ab01"}},i.a.createElement(v.a,{icon:"eye"}),i.a.createElement("div",null,"15.5m"),i.a.createElement("div",null,"Recent View (+32)")),i.a.createElement("div",{style:{backgroundColor:"#0650df"}},i.a.createElement(v.a,{icon:"user-plus"}),i.a.createElement("div",null,"4,500"),i.a.createElement("div",null,"New Followers (+90)")),i.a.createElement("div",{style:{backgroundColor:"#3808aa"}},i.a.createElement(v.a,{icon:"signal"}),i.a.createElement("div",null,"67.85%"),i.a.createElement("div",null,"Percentages (+20)")))),i.a.createElement("div",{style:{backgroundColor:"#f9fafc",borderTop:"1px solid #ebecef"}},i.a.createElement("div",{className:"main"},i.a.createElement("div",{style:{display:"flex",justifyContent:"space-between",margin:"20px auto"}},i.a.createElement("div",null,i.a.createElement(Y.a,{title:"Popular Pages"},i.a.createElement(Z.a.Item,{href:"#/action-1"},"Date Published"),i.a.createElement(Z.a.Item,{href:"#/action-2"},"Highest Rated"),i.a.createElement(Z.a.Item,{href:"#/action-3"},"Most Content"))),i.a.createElement("div",{style:{display:"flex",alignItems:"center"}},i.a.createElement("h5",{style:{margin:0}},"Add Page"),i.a.createElement(d.b,{to:"/pages/add"},i.a.createElement(N.a,{variant:"success",size:"lg",className:"circle"},i.a.createElement(v.a,{icon:"plus"}))))),i.a.createElement("div",{style:{display:"flex",flexWrap:"wrap"}},this.state.pages.map(function(t,a){return i.a.createElement(d.b,{to:"/pages/".concat(t.id),style:{color:"initial"}},i.a.createElement("div",{key:a,className:"page",style:{display:"flex"}},i.a.createElement("img",{src:"https://s3-us-west-1.amazonaws.com/".concat(e.state.S3_BUCKET,"/").concat(t.imageLink),style:{width:75,objectFit:"cover",marginRight:20}}),i.a.createElement("div",{style:{width:"100%"}},i.a.createElement("p",null,t.name),i.a.createElement("p",{style:{fontSize:14,color:"#a4A5A8"}},"Published: ",i.a.createElement(B.a,{format:"M.DD.YYYY",date:t.createdAt})),i.a.createElement("p",{style:{display:"flex",justifyContent:"space-between"}},i.a.createElement("span",null,"$38,250"),i.a.createElement("span",null,"5.5k Followers"),i.a.createElement("span",null,"+98%")))))})))))}}]),t}(n.Component),K=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).handleChange=function(e){a.setState(Object(b.a)({},e.target.name,e.target.value))},a.handleEditing=function(e){var t=e.currentTarget.getAttribute("name")+"Edit";a.setState(Object(b.a)({},t,!a.state[t]))},a.onImageChange=function(e){var t=e.target.files[0];a.setState({image:URL.createObjectURL(t),file:t,fileName:t.name,fileType:t.type})},a.state={image:"",name:"Page Name",description:"Short Description",summary:"Page Summary"},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){var e=window.localStorage.getItem("token");e&&this.setState({decoded:E()(e)})}},{key:"addPage",value:function(){var e=this.state,t=e.file,a=t.name.split("."),n=a[0],i=a[1];console.log("Preparing the upload",t);var r=new FormData;r.append("imgFile",t),j.a.post("/api/pages/add?userId="+e.decoded.id+"&name="+e.name+"&description="+e.description+"&summary="+e.summary+"&fileName="+n+"&fileType="+i,r).then(function(e){console.log(e)}).catch(function(e){console.error(e)})}},{key:"render",value:function(){var e=this;return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",null,i.a.createElement("div",{className:""===this.state.image?"imageBanner":"imageBanner set"},i.a.createElement("form",{action:"/add",method:"post",enctype:"multipart/form-data",style:{padding:0}},i.a.createElement("input",{type:"file",name:"imgFile",ref:function(t){return e.upload=t},onChange:this.onImageChange,style:{display:"none"}})),i.a.createElement("img",{src:this.state.image,style:{width:"100%",opacity:.2},alt:""}),i.a.createElement("div",{className:"textOverlay"},this.state.image?i.a.createElement("span",null):i.a.createElement(v.a,{icon:"plus",size:"6x",style:{opacity:.2},onClick:function(){e.upload.click()}}),this.state.nameEdit?i.a.createElement(G.a,null,i.a.createElement(W.a,{style:{width:"initial"},placeholder:this.state.name,name:"name",onChange:this.handleChange,onBlur:this.handleEditing})):i.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},i.a.createElement("h3",null,this.state.name),i.a.createElement(v.a,{icon:"pen",name:"name",onClick:this.handleEditing})),this.state.descriptionEdit?i.a.createElement(W.a,{style:{width:"initial"},placeholder:this.state.description,name:"description",onChange:this.handleChange,onBlur:this.handleEditing}):i.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},i.a.createElement("p",null,this.state.description),i.a.createElement(v.a,{icon:"pen",name:"description",onClick:this.handleEditing})))),i.a.createElement("div",{className:"main"},i.a.createElement("div",null,this.state.summaryEdit?i.a.createElement(G.a,null,i.a.createElement(W.a,{as:"textarea",style:{width:"initial"},placeholder:this.state.summary,name:"summary",onChange:this.handleChange,onBlur:this.handleEditing})):i.a.createElement("div",{style:{display:"flex"}},i.a.createElement("h4",null,this.state.summary),i.a.createElement(v.a,{icon:"pen",name:"summary",onClick:this.handleEditing}))),i.a.createElement(N.a,{variant:"success",size:"lg",style:{display:"block"},onClick:this.addPage.bind(this)},"+ Add Page"))))}}]),t}(n.Component),$=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).handleChange=function(e){a.state.page[e.target.name]=e.target.value},a.handleEditing=function(e){var t=e.currentTarget.getAttribute("name")+"Edit";a.setState(Object(b.a)({},t,!a.state[t]))},a.state={image:"",name:"Page Name",description:"Short Description",summary:"Page Summary",page:{}},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){var e=this;j.a.get("/api/pages/search?pageId="+this.props.match.params.pageId).then(function(t){console.log(t),e.setState({page:t.data.response[0],image:"https://s3-us-west-1.amazonaws.com/".concat(t.data.bucket,"/").concat(t.data.response[0].imageLink)})}).catch(function(e){console.error(e)})}},{key:"updatePage",value:function(){var e=this.state.page;j.a.put("/api/pages/update?id="+e.id+"&name="+e.name+"&description="+e.description+"&summary="+e.summary).then(function(e){console.log(e),window.location.reload()}).catch(function(e){console.error(e)})}},{key:"uploadVideo",value:function(){j.a.post("/api/content/add").then(function(e){console.log(e)}).catch(function(e){console.error(e)})}},{key:"render",value:function(){var e=this,t=this.state.page;return i.a.createElement(k.a,{transitionName:"fade",transitionAppear:!0,transitionAppearTimeout:500,transitionEnter:!1,transitionLeave:!1},i.a.createElement("div",null,i.a.createElement("div",{className:"imageBanner set"},i.a.createElement("input",{type:"file",ref:function(t){return e.upload=t},onChange:this.onImageChange,style:{display:"none"}}),i.a.createElement("img",{src:this.state.image,style:{width:"100%",opacity:.3},alt:""}),i.a.createElement("div",{className:"textOverlay"},this.state.image?i.a.createElement("span",null):i.a.createElement(v.a,{icon:"plus",size:"6x",style:{opacity:.1},onClick:function(){e.upload.click()}}),this.state.nameEdit?i.a.createElement(G.a,null,i.a.createElement(W.a,{style:{width:"initial"},placeholder:this.state.name,name:"name",onChange:this.handleChange,onBlur:this.handleEditing})):i.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},i.a.createElement("h3",null,t.name),i.a.createElement(v.a,{icon:"pen",name:"name",onClick:this.handleEditing})),this.state.descriptionEdit?i.a.createElement(W.a,{style:{width:"initial"},placeholder:this.state.description,name:"description",onChange:this.handleChange,onBlur:this.handleEditing}):i.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},i.a.createElement("p",null,t.description),i.a.createElement(v.a,{icon:"pen",name:"description",onClick:this.handleEditing})))),i.a.createElement("div",{className:"main"},i.a.createElement("div",{style:{display:"flex",alignItems:"center"}},i.a.createElement("h5",{style:{margin:0}},"Add Content"),i.a.createElement(d.b,{to:"/content/add"},i.a.createElement(N.a,{variant:"success",size:"lg",className:"circle",onClick:this.uploadVideo},i.a.createElement(v.a,{icon:"plus"})))),i.a.createElement("div",null,this.state.summaryEdit?i.a.createElement(G.a,null,i.a.createElement(W.a,{as:"textarea",style:{width:"initial"},placeholder:this.state.summary,name:"summary",onChange:this.handleChange,onBlur:this.handleEditing})):i.a.createElement("div",{style:{display:"flex"}},i.a.createElement("p",null,t.summary),i.a.createElement(v.a,{icon:"pen",name:"summary",onClick:this.handleEditing}))),i.a.createElement(N.a,{variant:"success",size:"lg",style:{display:"block"},onClick:this.updatePage.bind(this)},"Update Page"))))}}]),t}(n.Component),_=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).state={decoded:!1,login:!1},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"componentWillMount",value:function(){var e=window.localStorage.getItem("token");e&&this.setState({decoded:E()(e)})}},{key:"render",value:function(){return i.a.createElement(d.a,null,i.a.createElement("div",{className:"body"},i.a.createElement(y,{decoded:this.state.decoded,login:this.state.login,setState:this.setState.bind(this)}),this.state.decoded?i.a.createElement("div",null,i.a.createElement(h.a,{exact:!0,path:"/",component:L}),i.a.createElement(h.a,{path:"/dashboard",component:Q})):i.a.createElement("div",null,this.state.login?i.a.createElement(h.a,{path:"/",component:z}):i.a.createElement(h.a,{path:"/",component:R})),i.a.createElement(h.c,null,i.a.createElement(h.a,{path:"/pages/add",component:K}),i.a.createElement(h.a,{path:"/pages/:pageId",component:$})),i.a.createElement("link",{rel:"stylesheet",href:"https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",integrity:"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T",crossOrigin:"anonymous"})))}}]),t}(n.Component);g.b.add(f.a,f.b,f.c,f.d,f.f,f.e,f.g,f.h);var ee=_;Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(i.a.createElement(ee,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},78:function(e,t,a){e.exports=a(160)},83:function(e,t,a){},86:function(e,t,a){},95:function(e,t){e.exports="data:image/png;base64,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"}},[[78,1,2]]]);
//# sourceMappingURL=main.d23be382.chunk.js.map
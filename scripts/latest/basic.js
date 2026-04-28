var pe=Object.defineProperty;var ue=(h,d,b)=>d in h?pe(h,d,{enumerable:!0,configurable:!0,writable:!0,value:b}):h[d]=b;var _=(h,d,b)=>ue(h,typeof d!="symbol"?d+"":d,b);(function(){"use strict";class h extends Error{constructor({message:o,code:r,statusCode:n,detail:c}){super(o);_(this,"code");_(this,"statusCode");_(this,"detail");this.name="ApiError",this.code=r,this.statusCode=n,this.detail=c}}const d=(e,t)=>`${e.replace(/\/+$/,"")}${t}`,b=async e=>(e.headers.get("content-type")??"").includes("application/json")?e.json():await e.text()||null,v=async(e,t)=>{const o=await fetch(e,t),r=await b(o);if(!o.ok){const n=r&&typeof r=="object"?r:void 0;throw new h({message:(n==null?void 0:n.message)??`Request failed with status ${o.status}`,code:n==null?void 0:n.code,statusCode:(n==null?void 0:n.statusCode)??o.status,detail:(n==null?void 0:n.detail)??r})}return r},F=async(e,t)=>v(d(e,`/bubble/client/${encodeURIComponent(t)}/config`)),N=async(e,t)=>v(d(e,`/bubble/client/${encodeURIComponent(t)}/visitor-id`),{method:"POST"}),Y=async(e,t,o,r)=>{const n=encodeURIComponent(t);return v(d(e,`/chat/bubble?client_id=${n}`),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId:t,visitorId:o,content:r})})},G=async(e,t,o,r=1,n=50)=>{const c=encodeURIComponent(t),s=encodeURIComponent(o);return v(d(e,`/bubble/client/${c}/visitor/${s}/history?page=${r}&page_size=${n}`))},q=e=>e instanceof h?["INVALID_SIGNED_VISITOR_ID","INVALID_VISITOR_ID","INVALID_VISITOR_SIGNATURE"].includes(e.code??""):!1,K="/chatbot-plus/api/v2",$=e=>e.replace(/\/+$/,""),k=e=>`${$(e)}${K}`,L=e=>$(e),J=()=>{const e=document.querySelector("script[data-client-id], script[data-api-base-url]");return e instanceof HTMLScriptElement?e:null},P=({clientId:e,apiBaseUrl:t,backendUrl:o,scriptElement:r})=>{const n=r??J(),c=e??(n==null?void 0:n.getAttribute("data-client-id"))??void 0,s=(n==null?void 0:n.getAttribute("data-api-base-url"))??void 0;if(!c)throw new Error("Chat Widget: Missing clientId for initialization.");if(t)return{clientId:c,apiBaseUrl:L(t)};if(s)return{clientId:c,apiBaseUrl:L(s)};if(o)return{clientId:c,apiBaseUrl:k(o)};if(n!=null&&n.src){const i=new URL(n.src);return{clientId:c,apiBaseUrl:k(`${i.protocol}//${i.host}`)}}throw new Error("Chat Widget: Missing apiBaseUrl/backendUrl and unable to infer from script.")},X="chat_widget_visitor_token",Q="cbp_widget_signed_visitor_id",B=e=>{var o;const t=typeof window<"u"&&((o=window.location)!=null&&o.origin)?window.location.origin:"unknown-origin";return`${Q}:${t}:${L(e)}`},Z=e=>{try{return window.localStorage.getItem(e)}catch{return null}},ee=(e,t)=>{try{window.localStorage.setItem(e,t)}catch{}},V=e=>{try{window.localStorage.removeItem(e)}catch{}},A=e=>Z(B(e)),te=(e,t)=>{ee(B(e),t)},oe=e=>{V(B(e))},ne=()=>{V(X)},se=e=>e.data.flatMap(t=>(t.messages??[]).map(o=>o.content?{role:o.role==="human"?"user":"bot",content:o.content,timestamp:o.timestamp}:null).filter(o=>o!==null)),re=e=>{ne();let t=A(e.apiBaseUrl);const o=({visitorId:s})=>(t=s,te(e.apiBaseUrl,s),{visitorId:s}),r=async()=>(oe(e.apiBaseUrl),t=null,o(await N(e.apiBaseUrl,e.clientId))),n=async()=>{if(t)return{visitorId:t};const s=A(e.apiBaseUrl);return s?(t=s,{visitorId:s}):o(await N(e.apiBaseUrl,e.clientId))},c=async s=>{const i=await n();try{return await s(i.visitorId)}catch(u){if(!q(u))throw u;const x=await r();return s(x.visitorId)}};return{ensureVisitorSession:n,loadHistory:async()=>{const s=await c(i=>G(e.apiBaseUrl,e.clientId,i));return se(s)},sendMessage:async s=>({role:"bot",content:(await c(u=>Y(e.apiBaseUrl,e.clientId,u,s))).content})}},M="cbp-chat-widget-container",R="Type a message...",ae=(e,t,o=!1)=>{const r=document.createElement("div");return r.className=`message ${e.role}`,r.textContent=e.content,e.role==="user"&&(r.style.background=t),o&&(r.style.color="#dc2626"),r},ie=(e,t)=>{var j;(j=document.getElementById(M))==null||j.remove();const o=document.createElement("div");o.id=M;const r=o.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=`
    .chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: min(360px, calc(100vw - 24px));
      height: min(560px, calc(100vh - 32px));
      background: white;
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(15, 23, 42, 0.18);
      display: flex;
      flex-direction: column;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
      transform: translateY(120%);
      transition: transform 0.3s ease, opacity 0.3s ease;
      z-index: 10000;
      opacity: 0;
    }

    .chat-widget.open {
      transform: translateY(0);
      opacity: 1;
    }

    .chat-header {
      background: ${e.primaryColor};
      color: white;
      padding: 16px 18px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .chat-title {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      padding: 0;
    }

    .chat-body {
      flex: 1;
      padding: 18px;
      overflow-y: auto;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 0.92rem;
      line-height: 1.45;
      word-break: break-word;
    }

    .message.bot {
      background: white;
      color: #334155;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
      border: 1px solid #e2e8f0;
    }

    .message.user {
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }

    .chat-footer {
      background: white;
      border-top: 1px solid #e5e7eb;
      padding: 14px 16px 16px;
    }

    .status-text {
      min-height: 18px;
      color: #64748b;
      font-size: 0.75rem;
      margin-bottom: 8px;
    }

    .chat-input-row {
      display: flex;
      gap: 8px;
    }

    .chat-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 999px;
      outline: none;
      font-size: 0.92rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .chat-input:focus {
      border-color: ${e.primaryColor};
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    .chat-input:disabled {
      background: #f8fafc;
      color: #94a3b8;
      cursor: not-allowed;
    }

    .send-btn {
      background: ${e.primaryColor};
      color: white;
      border: none;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s ease, transform 0.2s ease;
      flex-shrink: 0;
    }

    .send-btn:hover:not(:disabled) {
      opacity: 0.92;
      transform: translateY(-1px);
    }

    .send-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      transform: none;
    }

    .launcher {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${e.primaryColor};
      border: none;
      color: white;
      padding: 0;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.18);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: transform 0.2s ease, filter 0.2s ease, opacity 0.2s ease;
    }

    .launcher:hover {
      transform: scale(1.04);
      filter: brightness(1.04);
    }

    .launcher.hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.85);
    }

    .launcher svg,
    .send-btn svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    @media (max-width: 640px) {
      .chat-widget {
        right: 12px;
        bottom: 12px;
        width: calc(100vw - 24px);
        height: min(560px, calc(100vh - 24px));
      }

      .launcher {
        right: 12px;
        bottom: 12px;
      }
    }
  `;const c=document.createElement("div"),s=document.createElement("button");s.className="launcher",s.type="button",s.setAttribute("aria-label",`Open ${e.botName} chat`),s.innerHTML='<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';const i=document.createElement("div");i.className="chat-widget";const u=document.createElement("div");u.className="chat-header";const x=document.createElement("span");x.className="chat-title",x.textContent=e.botName;const f=document.createElement("button");f.className="close-btn",f.type="button",f.setAttribute("aria-label","Close chat"),f.innerHTML="&times;",u.appendChild(x),u.appendChild(f);const m=document.createElement("div");m.className="chat-body";const I=document.createElement("div");I.className="chat-footer";const T=document.createElement("div");T.className="status-text";const C=document.createElement("div");C.className="chat-input-row";const l=document.createElement("input");l.type="text",l.className="chat-input",l.placeholder=R;const g=document.createElement("button");g.className="send-btn",g.type="button",g.setAttribute("aria-label","Send message"),g.innerHTML='<svg viewBox="0 0 24 24"><path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"/></svg>',C.appendChild(l),C.appendChild(g),I.appendChild(T),I.appendChild(C),i.appendChild(u),i.appendChild(m),i.appendChild(I),c.appendChild(s),c.appendChild(i),r.appendChild(n),r.appendChild(c),document.body.appendChild(o);const ce=()=>{requestAnimationFrame(()=>{m.scrollTop=m.scrollHeight})},O=()=>{for(;m.firstChild;)m.removeChild(m.firstChild)},w=(a,p=!1)=>{m.appendChild(ae(a,e.primaryColor,p)),ce()};(()=>{O(),w({role:"bot",content:e.welcomeMessage})})();const E=(a,p)=>{l.disabled=a,g.disabled=a,l.placeholder=a?p??"Please wait...":R,T.textContent=a?p??"":""};let S=!1,y=!1,U=!1;const D=async()=>{if(!(S||y)){y=!0,E(!0,"Loading conversation...");try{await t.ensureVisitorSession();const a=await t.loadHistory();a.length>0&&(O(),a.forEach(p=>w(p))),S=!0}catch(a){console.error("Chat Widget: Failed to bootstrap conversation.",a),w({role:"bot",content:"Sorry, we could not load your conversation right now."},!0)}finally{y=!1,E(!1),i.classList.contains("open")&&l.focus()}}},de=()=>{i.classList.add("open"),s.classList.add("hidden"),D(),!y&&!U&&l.focus()},H=()=>{i.classList.remove("open"),s.classList.remove("hidden")},le=()=>{i.classList.contains("open")?H():de()};s.addEventListener("click",le),f.addEventListener("click",H);const W=async()=>{const a=l.value.trim();if(!(!a||U||y)){S||await D(),l.value="",w({role:"user",content:a}),U=!0,E(!0,"Sending...");try{const p=await t.sendMessage(a);w(p),S=!0}catch(p){console.error("Chat Widget: Failed to send message.",p),w({role:"bot",content:"Sorry, failed to send your message. Please try again."},!0)}finally{U=!1,E(!1),l.focus()}}};g.addEventListener("click",()=>{W()}),l.addEventListener("keydown",a=>{a.key==="Enter"&&(a.preventDefault(),W())})},z=async()=>{try{const e=P({}),t=await F(e.apiBaseUrl,e.clientId),o=re(e);ie(t,o)}catch(e){console.error("Chat Widget Initialization Error:",e)}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",z):z()})();

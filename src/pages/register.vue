<template>
  <div class="register">
    <logo></logo>
    <div class="content">
      <div class="wrap">
        <div class="box">
          <div class="close-icon" @click="$router.go(-1)"></div>
          <div class="form">
            <h2>填写注册信息<br>
              <img src="/static/bfl-img/common/write.png" alt="">
              <span>快速注完成帐号创建 , 即可完成登录体验 !</span>
            </h2>
            <div class="input-box input-icon">
              <!-- <img src="/static/bfl-img/common/phone.png" alt=""> -->
              <i class="el-icon-mobile-phone"></i>
              <input type="text" idx="0" placeholder="手机号码" v-model="phoneNum" @keyup.enter="nextInput">
              <div class="err-box" v-if="phoneErr">
                <i class="el-icon-warning"></i>
                <span>{{phoneErr}}</span>
              </div>
            </div>
            <div class="input-box input-phoneCode">
              <input type="text" idx="1" placeholder="手机验证码" v-model="phoneCode" @keyup.enter="nextInput">
            </div><!-- 
             --><div class="phoneCode-btn" :class ="{'loading': isCodelLoading || countDown > -1}" @click="getPhoneCode">{{isCodelLoading ? '正在获取...' : (countDown > -1 ? '重新获取 ' + countDown + 's' : '获取验证码')}}
                <div class="err-box" v-if="phoneCodeErr">
                  <i class="el-icon-warning"></i>
                  <span>{{phoneCodeErr}}</span>
                </div>
            </div>
            <div class="input-box input-icon">
              <img src="/static/bfl-img/common/pwd.png" alt="">
              <input type="password" idx="2" placeholder="请输入密码" v-model="pwd1" @focus="isShowSee = true" @keyup.enter="nextInput"><i v-show="isShowSee" class="el-icon-view canSee" @click="canSee"></i>
              <div class="err-box" v-if="pwd1Err">
                <i class="el-icon-warning"></i>
                <span>{{pwd1Err}}</span>
              </div>
            </div> 
            <div class="input-box input-icon">
              <img src="/static/bfl-img/common/pwd.png" alt="">
              <input type="password" placeholder="请再次输入密码" v-model="pwd2" @focus="isShowSee2 = true" @keyup.enter="toRegister"><i v-show="isShowSee2" class="el-icon-view canSee" @click="canSee"></i>
              <div class="err-box" v-if="pwd2Err">
                <i class="el-icon-warning"></i>
                <span>{{pwd2Err}}</span>
              </div>
            </div>
            <!-- <div class="input-box input-icon">
              <i class="el-icon-message"></i>
              <input type="text" placeholder="邮箱账号" v-model.lazy="mail">
              <div class="err-box" v-if="mailErr">
                <i class="el-icon-warning"></i>
                <span>{{mailErr}}</span>
              </div>
            </div> -->
            <div class="checked-box">
              <el-checkbox v-model="checked">我已阅读并同意<span class="clause" @click="isShowClause = true">《缤纷乐网络服务使用协议》</span></el-checkbox>
            </div>
            <a href="javascript:" class="input-box register-btn" @click="toRegister">注册</a>
          </div>
        </div>
      </div>
    </div>
    <div class="footerBox">
      <vueFooter></vueFooter>
    </div>
    <!-- 服务条款 -->
    <el-dialog :visible.sync="isShowClause" width="74%">
      <div class="unit4">
        <p class="font9_14pxb" style="font-size: 14px; position: relative; top: -10px;">
          《缤纷乐网络服务使用协议》</p>
        <p>
          一、<a href="#xy1">协议的生效与修改</a>
          <br>
          二、<a href="#xy2">缤纷乐的服务内容</a><br>
          三、<a href="#xy3">用户注册</a><br>
          四、<a href="#xy4">用户和缤纷乐的权利义务</a>
          <br>
          五、<a href="#xy5">第三方链接</a>
          <br>
          六、<a href="#xy6">知识产权保护</a>
          <br>
          七、<a href="#xy7">涉嫌侵权的通知、反通知和处理</a>
          <br>
          八、<a href="#xy8">用户秘密的保护</a>
          <br>
          九、<a href="#xy9">免责声明</a>
          <br>
          十、<a href="#xy10">服务的终止</a>
          <br>
          十一、<a href="#xy11">法律适用和管辖</a>
          <br>
          十二、<a href="#xy12">附则</a>
          <br>
          <br>
          <span class="strong">重要提请注意</span><span class="strong">：作为“</span><span class="strong"><a href="http://www.j-ink.cn">www.j-ink.cn</a></span><span class="strong">”（以下简称“缤纷乐”）网络服务的运营商，上海诺彩信息技术有限公司在此特别提醒，用户欲访问和使用缤纷乐，请事先认真阅读本协议各项条款，尤其需注意免除或者限制缤纷乐责任的免责条款和对用户权利的限制。</span><span style="margin-top: 20px"><a name="xy1" id="xy1"></a></span></p>
        <p style="margin-top: 20px">
          <span class="strong">一、协议的生效与修改 </span>
          <br>
          本协议是用户（包括但不限于注册会员、非注册会员和游客等）与上海诺彩信息技术有限公司（以下简称“上海诺彩”）之间的协议，上海诺彩依据本协议通过缤纷乐为用户提供服务。<br>
          1、本协议各项条款系用户使用缤纷乐所提供服务的必要前提条件。如用户不同意本协议条款（包括全部条款和部分条款）、或不同意缤纷乐随时对协议条款的修改更新，用户应不使用或主动取消缤纷乐提供的服务；用户的使用行为将被视为用户对本协议条款或缤纷乐随时修改版本的完全接受；<br>
          2、缤纷乐享有本协议的单方随时修改权，且不须另行通知或征得用户同意，但应遵循公平诚信原则。修改后的协议条款一旦在缤纷乐网络上公布即取代替之前的协议条款，用户可随时登陆缤纷乐查阅最新的协议条款；用户与上海诺彩之间的争议一律按缤纷乐网络上公布协议的最新版本执行，不再适用之前的协议版本。</p>
        <a name="xy2" id="xy2"></a>
        <p style="margin-top: 20px">
          <span class="strong">二、缤纷乐的服务内容 </span>
          <br>
          缤纷乐是一家提供包括相册书在内的各类个性印品的制作及相关服务的新型个性印品公司。缤纷乐免费向用户提供包括相册书在内的各类个性印品制作之前的相关服务，免费提供“缤纷乐转模板软件”、“缤纷乐时尚印品软件”，供用户自行创意设计各种丰富多彩的个性印品模板和个性印品作品；缤纷乐本身不直接上传任何个性印品模板和个性印品作品，仅提供信息网络存储空间及相关平台服务，供用户上传、下载和分享所创意设计的个性印品模板和个性印品作品。
          <br>
          缤纷乐向用户提供服务包括但不限于：
          <br>
          1、“缤纷乐转模板软件”的免费下载和使用；
          <br>
          2、“缤纷乐时尚印品软件”的免费下载和使用；
          <br>
          3、缤纷乐通过运营的服务器，为用户提供信息网络存储空间，免费供用户上传、下载、浏览和分享所制作的各类个性印品模板和个性印品作品；
          <br>
          4、根据用户要求，缤纷乐提供包括相册书在内的各类实物个性印品的制作和送货（注：该服务为收费服务）；
          <br>
          5、提供“缤纷论坛”，供用户在论坛上交流经验、发表评论、提出建议以及投诉等；
          <br>
          6、缤纷乐向用户提供的其他技术和服务。 <a name="xy3" id="xy3"></a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">三、用户注册 </span>
          <br>
          用户若在缤纷乐提供的网络存储空间进行各类个性印品模板及作品的上传、分享以及提出实物个性印品的制作要求，需注册一个帐号、密码，并确保注册信息的真实性、正确性及完整性，如果上述注册信息发生变化，用户应及时更改。在注册成功后，用户应维持密码及帐号的机密安全。用户应对任何人利用该用户的密码及帐号所进行的活动承担全部责任，缤纷乐无法对非法或未经用户授权使用帐号及密码的行为做出甄别，因此缤纷乐不承担任何责任。鉴于上述情况，用户应同意遵守以下内容：<br>
          1、当密码或帐号遭到未获授权的使用，或者发生其他任何安全问题时，用户应及时有效地通知缤纷乐；<br>
          2、用户同意接受缤纷乐通过电子邮件、网页或其他合法方式发送的商品信息、宣传信息、广告信息以及通知等；
          <br>
          3、用户不得故意冒用他人信息为自己注册缤纷乐帐号，不得未经他人合法授权以他人名义注册，也不得使用侮辱、诽谤、色情等违反公序良俗的词语注册；
          <br>
          4、用户同意缤纷乐有权根据自己的判定，对违反上述条款的用户拒绝提供帐号注册或取消该帐号的使用；<br>
          5、缤纷乐根据要求对用户所有注册信息予以保密，但国家法律强制要求披露的除外。 <a name="xy4" id="xy4"></a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">四、用户和缤纷乐的权利义务 </span>
          <br>
          作为提供相册书和其他个性印品的制作及相关服务的新型印品公司，缤纷乐本身不直接设计并上传任何各类个性印品模板和相册书作品，仅提供信息网络存储空间及相关平台服务，供用户上传、下载和分享所制作的模板、相册书和个性印品。用户、缤纷乐的权利义务主要如下：<span class="strong">
          </span>
          <br>
          1、用户享有设计、上传、浏览、下载、使用、复制和修改各类个性印品模板和其他个性印品作品的权利，并有权要求缤纷乐以收费的形式提供实物相册书和其他个性印品，有权在论坛上交流经验、发表评论、提出建议以及投诉等；
          <br>
          2、用户对其自行设计并上传到缤纷乐的各类个性印品模板和各种个性印品作品，必须确保所有内容均为合法拥有、使用或征得权利人同意，如原创作品、自身肖像、有权使用的肖像或作品等，严禁侵犯他人作品和肖像，严禁传播反动、暴力和色情等信息；否则，用户应承担违法使用所产生的全部法律责任；
          <br>
          3、用户若同意分享其所上传至缤纷乐的各类个性印品模板和各类个性个性印品作品，即视为该用户在此同意缤纷乐的其他用户有权浏览、下载、使用、复制和修改上述作品；如其他用户提出要求，缤纷乐亦有权制作其他用户因使用和修改上述作品而产生的个性印品作品。用户的上述同意分享均为免费、不可撤销的和无限期的；
          <br>
          其他用户浏览、下载、使用、复制和修改上述同意分享的各类个性印品模板，仅限于个人欣赏和学习交流用途，在未获得权利人授权之前，勿作它用，严禁用于商业目的和赢利性活动，严禁损害他人名誉和形象；如因非法使用引起纠纷，一切后果由使用者承担。<br>
          4、缤纷乐并不确保用户同意分享的各类个性印品模板和各类个性印品作品均能通过缤纷乐服务为其他用户所获取、浏览，缤纷乐保留在不事先通知的情况下删除的权利，用户不得要求缤纷乐承担法律责任或提出相应赔偿；对有证据证明反复上传侵权作品的用户，缤纷乐有权随时取消该用户帐号的使用；<br>
          5、作为信息网络存储空间的提供者，缤纷乐没有义务和责任对所有用户上传和同意分享的各类个性印品模板和个性印品作品进行合法性审查；但是当权利人提出侵权通知并出示充分的权利证明材料时，缤纷乐负有迅速删除的义务；<br>
          6、作为信息网络存储空间的提供者，缤纷乐对于用户上传、下载、使用、复制和修改模板、相册书和个性印品的正确性和美感度不承担责任，由用户自行负责，但因缤纷乐转模板软件和印品软件自身问题造成的除外；<br>
          7、因缤纷乐对用户上传的模板、相册书和个性印品不负有合法性审查义务，如可能会接触到令人不快、不适当或令人厌恶之内容，用户同意放弃由此而产生的针对缤纷乐的任何追索权。
          <a name="xy5" id="xy5"></a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">五、第三方链接 </span>
          <br>
          为方便用户使用，缤纷乐可能会提供与第三方国际互联网网站或资源进行链接。除非另有声明，缤纷乐无法对第三方网站服务进行控制，用户因使用或依赖上述网站或资源所产生的损失或损害，缤纷乐不承担任何责任。
          <a name="xy6" id="xy6"></a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">六、知识产权保护 </span>
          <br>
          1、除用户上传、传播的内容外，缤纷乐的服务中包含的任何网页、文本、图片、图形、音频和/或视频资料、商标、服务标记、公司名称、版权等，均归属缤纷乐所有或合法使用，受《中华人民共和国民法通则》、《中华人民共和国著作权法》、《中华人民共和国商标法》和/或其它民事法律的保护。上述资料可作为私人用途而保存在某台计算机内，或在互联网上传播，但仅限于用户个人欣赏、学习交流以及宣传介绍缤纷乐服务的用途；未经缤纷乐或相关权利人同意，不得被用于除缤纷乐之外其他经营者的任何商业目的或赢利性活动。<br>
          2、缤纷乐因各类个性印品制作服务而向用户免费提供的任何软件（包括但不限于“缤纷乐时尚印品软件”、“缤纷乐转模板软件”以及软件中所含的任何图像、照片、动画、录像、录音、音乐、文字和附加程序、随附的帮助材料）的一切权利均属于该软件的著作权人，用户使用的范围仅限于个人欣赏、学习交流以及宣传介绍缤纷乐服务的用途。未经该软件的著作权人许可，用户不得被用于除缤纷乐之外其他经营者的任何商业目的或赢利性活动，不得对该软件进行反向工程（reverse
          engineer）、反向编译（decompile）或反汇编（disassemble），或以其他方式发现其原始编码。<a name="xy7" id="xy7"></a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">七、涉嫌侵权的通知、反通知和处理 </span>
          <br>
          1、涉嫌侵权的通知和处理<br>
          如果涉嫌被侵权的权利人认为用户通过缤纷乐提供的的信息存储空间上载、传播的内容（包括但不限于各类个性印品模板和个性印品作品等）侵犯了其权利的，可以在线或线下向缤纷乐提交书面通知，要求删除该内容。通知书需权利人或其合法授权人亲笔签名，若为单位则需加盖单位公章。权利人应对通知书的真实性负责。若通知书的内容不真实，权利人将承担由此造成的全部法律责任。通知书应当包含下列内容：<br>
          （1）权利人的姓名（名称）、联系方式、地址、身份证复印件（自然人）、单位登记证明复印件（单位）；<br>
          （2）要求删除的涉嫌侵权内容的准确名称和网络地址，以便缤纷乐能够发现并确认侵权内容；<br>
          （3）认为构成侵权的初步证明材料，包括但不限于对作品享有著作权或依法享有的其他权属证明等。<br>
          缤纷乐收到权利人的通知后，将立即删除涉嫌侵权的内容，并同时将通知书转送权利人；除履行反通知程序外，对使用同一账号多次上传同一侵权作品的用户，缤纷乐有权不事先通知随时终止该账号的使用。
          <br>
          2、涉嫌侵权的反通知和处理<br>
          内容提供者收到缤纷乐转送的通知书后，认为其提供的内容并未侵犯他人权利的，可向缤纷乐提交反通知的书面说明，要求恢复被删除的内容。反通知书需权利人或其合法授权人亲笔签名，若为单位则需加盖单位公章。内容提供者应对反通知书的真实性负责。若通知书的内容不真实，提供者将承担由此造成的全部法律责任。反通知应当包含下列内容：<br>
          （1）内容提供者的姓名（名称）、联系方式、地址、身份证复印件（自然人）、单位登记证明复印件（单位）；<br>
          （2）要求恢复被删除内容的准确名称和网络地址，以便缤纷乐能够发现并确认侵权内容；<br>
          （3）认为不构成侵权的初步证明材料，包括但不限于对作品享有著作权或其他权属证明等。<br>
          缤纷乐收到内容提供者的反通知后，将立即恢复被删除的内容，同时将内容提供者的反通知转送权利人。缤纷乐对恢复被删除内容的行为不承担任何法律责任。权利人如对反通知内容有异议的，可提交司法机关或行政主管机关裁决；上述机关的最终裁决生效后，缤纷乐必须遵照执行，进行相应删除或恢复处理。<a name="xy8" id="xy8"></a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">八、用户秘密的保护 </span>
          <br>
          1、当用户注册缤纷乐的帐号时，用户须提供用户信息。用户信息提供的目的主要是方便缤纷乐为该用户提供尽可能多的个人化网上服务，以及为缤纷乐或广告商提供一个方便的途径来接触到适合的用户，并且可以发送具有相关性的内容和广告。未经用户同意，缤纷乐不得公开、编辑或透露用户信息及保存的非公开内容，除非下列情况：<br>
          （1）有关法律规定或缤纷乐服务中规定；<br>
          （2）在紧急情况下，为维护用户及公众的权益；<br>
          （3）为维护缤纷乐的合法权益的合理使用；<br>
          （4）其他依法需要公开、编辑或透露用户信息的情况。
          <br>
          2、在以下（包括但不限于）几种情况下，缤纷乐有权使用用户信息：
          <br>
          （1）在进行促销或抽奖时，缤纷乐可能会与赞助商共享用户信息，在这些情况下缤纷乐会在发送用户信息之前进行提示，并且用户可以通过不参与来终止传送过程；
          <br>
          （2）基于介绍、宣传缤纷乐的服务，缤纷乐会通过透露经营信息，向未来的合作伙伴、广告商及其他第三方提供；<br>
          （3）用户购买在缤纷乐所提供的商品或服务时，缤纷乐获得的信息及用户提供的信息将会提供给缤纷乐的下属供应商。<a name="xy9" id="xy9"></a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">九、免责声明 </span>
          <br>
          1、缤纷乐不保证适合用户的使用要求，不保证所提供的产品、服务和资料符合用户的期望；<br>
          2、用户使用经由缤纷乐下载或取得的任何资料，其风险由用户自行承担；因不合理使用上述资料导致电脑系统损坏或资料流失，用户应自行承担全部责任；
          <br>
          3、基于以下原因而造成的利润、商业信誉、资料损失或其他有形或无形损失，缤纷乐不承担任何间接赔偿责任：<br>
          （1）对缤纷乐的使用或无法使用；<br>
          （2）经由缤纷乐购买或取得的任何产品、资料或服务；<br>
          （3）用户资料遭到未授权的使用或修改；<br>
          （4）其他与缤纷乐相关的事宜。
          <br>
          4、缤纷乐通过中华人民共和国境内的设施提供服务，缤纷乐不担保所提供的服务在其他国家或地区是适当可行的，任何在其他司法管辖区使用缤纷乐服务的用户应自行确保遵守当地的法律、法规，缤纷乐对此不负任何责任。<a name="xy10" id="xy10"></a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">十、服务的终止 </span>
          <br>
          1、用户同意缤纷乐有权基于其自行之考虑，因任何理由，包括但不限于长期使用、违法使用以及不当使用等，无需进行事先通知即可中断或终止用户的帐号或服务之全部或任何部分，并将用户在服务内的任何内容进行删除，但明确约定收费的项目除外；<br>
          2、用户同意若缤纷乐的服务使用被中断、终止或用户帐号及相关信息和文件被关闭、删除，缤纷乐对该用户或任何第三人均不承担任何责任。 <a name="xy11" id="xy11">
          </a>
        </p>
        <p style="margin-top: 20px">
          <span class="strong">十一、法律适用和管辖 </span>
          <br>
          1、本协议的生效、履行、解释及争议的解决均适用中华人民共和国法律；
          <br>
          2、本协议的履行如发生争议，用户和上海诺彩信息技术有限公司应友好协商解决；协商不成的，协议各方均应向上海诺彩信息技术有限公司所在地人民法院提起诉讼。 <a name="xy12" id="xy12"></a>
        </p>
        <p style="margin-top: 20px; margin-bottom: 20px">
          <span class="strong">十二、附则 </span>
          <br>
        </p>
        <span class="STYLE1">本协议最新修改时间为2009年8月1日，协议解释权属上海诺彩信息技术有限公司所有，如与中华人民共和国相关法律法规相抵触，应以法律法规为准。</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import logo from '@/components/logo'
import vueFooter from '@/components/vueFooter'

export default {
  name: 'register',
  components: {
    logo,
    vueFooter
  },
  data () {
    return {
      phoneNum: '',
      checked: true,
      pwd1: '',
      pwd2: '',
      phoneCode: '', // 短信验证码
      // mail: '',
      err: '',
      phoneErr: '', // 此手机已经注册过了
      phoneCodeErr: '', // 验证码错误
      pwd1Err: '', // 密码错误
      pwd2Err: '', // 密码错误
      // mailErr: '', // 邮箱不能为空
      isShowClause: false, // 是否显示服务条款
      isShowSee: false, // 是否显示密码输入框小眼睛
      isShowSee2: false, // 是否显示密码输入框小眼睛
      isCodelLoading: false, // 正在获取短信验证码
      countDown: -1, // 正在倒计时
      timer: '', // 计时器
    }
  },
  watch: {
    /*phoneNum(newVal) {
      if(newVal == '') {
        this.phoneErr = '请输入您的手机号码'
      } else if(newVal.length != 11 || !this.checkNumber(newVal)) {
        this.phoneErr = '手机号码格式不正确,请重新输入'
      } else {
        this.phoneErr = ''
      }
    },
    pwd1(newVal) {
      if(newVal == '') {
        this.pwd1Err = '密码不能为空'
      } else if(!this.isPasswd(newVal)) {
        this.pwd1Err = '6-20位字母/数字/下划线/小数点'
      } else {
        this.pwd1Err = ''
      }
    },
    pwd2(newVal) {
      if(newVal == '') {
        this.pwd2Err = '请再次输入密码'
      } else if(newVal != this.pwd1) {
        this.pwd2Err = '密码错误'
      } else {
        this.pwd2Err = ''
      }
    },*/
    deep: true
  },
  methods: {
    checkNumber(theObj) { //验证字符串是否是数字
      var reg = /^[0-9]+.?[0-9]*$/
      if (reg.test(theObj)) {
        return true
      }
      return false
    },
    /*isPasswd(s) { //只能输入6-20个字母、数字、下划线 
      var patrn = /^(\w){6,20}$/
      if (!patrn.test(s)) return false
      return true
    },*/
    isPasswd(s) {
      // var patrn = /^(\w){6,20}$/ //只能输入6-20个字母、数字、下划线 
      var patrn = /^(\w|[.]){6,20}$/ // 6-20个字母、数字、下划线、小数点
      if (!patrn.test(s)) return false
      return true
    },
    toRegister() {
      this.phoneErr = ''
      this.phoneCodeErr = ''
      this.pwd1Err = ''
      this.pwd2Err = ''
      if(this.phoneNum == '') {
        this.phoneErr = '请输入您的手机号码'
      } else if(this.phoneNum.length != 11 || !this.checkNumber(this.phoneNum)) {
        this.phoneErr = '手机号码格式不正确,请重新输入'
      } else if(this.phoneCode == '') {
        this.phoneCodeErr = '验证码不能为空'
      } else if(this.pwd1 == '') {
        this.pwd1Err = '密码不能为空'
      } else if(!this.isPasswd(this.pwd1)) {
        this.pwd1Err = '6-20位字母/数字/下划线/小数点'
      } else if(this.pwd2 == '') {
        this.pwd2Err = '请再次输入密码'
      } else if(this.pwd2 != this.pwd1) {
        this.pwd2Err = '密码错误'
      }
      if(this.phoneErr != '' || this.phoneCodeErr != '' || this.pwd1Err != '' || this.pwd2Err != '') {
        return
      } else if(!this.checked) {
        this.$alert('请阅读并同意《缤纷乐网络服务使用协议》', {
          confirmButtonText: '确定',
          type: 'error',
        })
      } else {
        var data = {
          "id": this.phoneNum, 
          "pwd": this.$SHA256(this.pwd2).toString(), // 密码加密
          // "pwd": this.pwd2,
          "code": this.phoneCode
        }
        console.log(data)
        this.$axios.post(this.sApi.userinfo + '?t=reg', data).then(response => {
          console.log(response)
          var res = response.data
          if(res.type == '1') {
            this.$confirm('注册成功, 是否去登录账号?', '提示', {
              confirmButtonText: '去登录',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.push({path: 'login'})
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              }); 
            })
          }
        })
      }
    },
    canSee(e) {
      var icon = $(e.target)
      var input = icon.prev()
      if(input.attr('type') == 'password') {
        input.attr('type', 'text')
        icon.addClass('on')
      } else if(input.attr('type') == 'text') {
        input.attr('type', 'password')
        icon.removeClass('on')
      }
    },
    nextInput(e) {
      $($('.input-box > input')[$(e.target).attr('idx') * 1 + 1]).focus()
    },
    getPhoneCode() {
      if(this.countDown == -1) {
        if(this.phoneNum) {
          this.isCodelLoading = true
          this.$axios.post(this.sApi.util + '?t=tcode&type=1&tel=' + this.phoneNum).then(response => {
            this.isCodelLoading = false
            let res = response.data
            if(res.type == 1) {
              this.$alert('稍后短信将发送至您手机, 请注意查收!', '提示', {
                confirmButtonText: '确定',
                type: 'success',
                callback: action => {}
              });
              this.countDown = 60
              this.timer = setInterval(() => {
                this.countDown--;
                if (this.countDown <= 0) {
                  this.countDown = -1
                  clearInterval(this.timer); // 清除答题限时定时器
                }
              }, 1000)
            }
          })
        }
      }
    },
  },
  mounted() {
    // console.log(this.$SHA256('dfbhfghdfjfdhffnfvgnghjghjghjghjgdfhxfdhsdhahfdhg').toString())
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register {height: calc(100% - 30px);}
/*.logoBox {height: 8%;}*/
.footerBox{width: 100%; position: absolute; bottom: 0;}
.register .content {width: 100%; background: url(/static/bfl-img/login-bg.jpg) no-repeat; position: absolute; background-size: contain; top: 100px; bottom: 0;}
.register .content .wrap {margin-top: 60px; text-align: right;}
.register .content .wrap .box {width: 40%; max-width: 578px; display: inline-block; background: #fff; text-align: center; padding: 24px 0 33px; box-shadow: 10px 10px 15px #ccc; position: relative;}
/* .register .content {background: url(/static/bfl-img/login-bg.jpg) no-repeat center / cover; height: 740px; margin-bottom: 130px;}
.register .content .wrap {padding-top: 4.5%; padding-left: 50%; padding-bottom: 30px;}
.register .content .wrap .box {width: 560px; -height: 590px; background: #fff; text-align: center; padding-top: 34px; box-shadow: 10px 10px 15px #ccc; position: relative; padding-bottom: 66px;} */
.register .content .wrap .box .form {width: 61%; margin: 0 66px; position: relative; font-size: 12px;}
.register .content .wrap .box .close-icon {margin-right: 10px;}
.register .content .wrap .box h2 {font-size: 20px; margin-bottom: 10px; text-align: left; position: relative;}
.register .content .wrap .box h2 > span {font-size: 12px; color: #aaa;}
.register .content .wrap .box h2 > img {position: absolute; left: -30px; top: 0;}
.tip-box {width: 100%; position: absolute; text-align: left;}
.checked-box,
.register .content .wrap .box .select-box,
.register .content .wrap .box .input-box {width: 100%; height: 40px; display: inline-block; border: 1px solid #dbdbdb; margin-top: 8px; text-align: left; line-height: 40px; padding: 0 8px; position: relative;}
.register .content .wrap .box .input-box:hover {border-color: #b6b6b6;}
.register .content .wrap .box .input-box .til {vertical-align: top; color: #c0c4cc;}
.register .content .wrap .box .input-box.input-icon > i,
.register .content .wrap .box .input-box.input-icon > img {margin-top: 9px; position: absolute; font-size: 22px; color: #d7d7d7;}
.register .content .wrap .box .input-box input {width: 100%; height: 100%; border: none; float: right; line-height: 40px; display: inline-block;}
.register .content .wrap .box .err-box {position: absolute; width: 144px; height: 40px; display: inline-block; right: -152px; top: 0; color: #fa821d; text-align: left;}
.register .content .wrap .box .err-box > span {width: 124px; line-height: 20px; display: inline-block; vertical-align: middle;}
.register .content .wrap .box .err-box > i {font-size: 14PX; margin-right: 2px; vertical-align: middle;}
.register .content .wrap .box .input-box.input-icon input {padding-left: 26px;}
.register .content .wrap .box .picCode-box {display: inline-block; width: 138px; height: 40px; line-height: 40px; vertical-align: top; margin-top: 8px; background: #f5f5f5; text-align: left; padding: 0 6px; position: relative;}
.register .content .wrap .box .picCode-box > img {width: 66px; margin-top: 4px; vertical-align: top;}
.register .content .wrap .box .picCode-box > span {font-size: 14px; line-height: 40px; padding-left: 5px; color: #33a890; cursor: pointer;}
.register .content .wrap .box .picCode-box > span > i {font-size: 20px; vertical-align: middle;}
.register .content .wrap .box .input-phoneCode {width: 56%; vertical-align: middle; border-right: none;}
.register .content .wrap .box .phoneCode-btn {width: 44%; height: 40px; line-height: 40px; display: inline-block; vertical-align: middle; margin-top: 8px; background: #33a890; color: #fff; font-size: 12px; cursor: pointer; position: relative;}
.register .content .wrap .box .phoneCode-btn:hover {background: #48ad98;}
.register .content .wrap .box .phoneCode-btn.loading {background: #ccc;}
.register .content .wrap .box .checked-box {text-align: left; border-color: transparent; padding: 0; margin: 0 0 14px 0;}
.register .content .wrap .box a.register-btn {display: inline-block; text-align: center; background: #34a88e; color: #fff; font-size: 16px; border-color: #34a88e; margin-top: 0;}
.register .content .wrap .box a.register-btn:hover,
.register .content .wrap .box span.phoneCode-btn:hover {background: #39b99f;}
.register .content .wrap .box a.register-btn:hover {border-color: #34a88e;}
.register .content .wrap .box .checked-box .clause {color: #fa821d; }

.register .content .wrap .box .input-box.input-icon i.canSee {position: absolute; right: 14px; color: #e5e5e5; margin-top: 0; line-height: 40px;}
.register .content .wrap .box .input-box.input-icon i.canSee:hover {color: #b6b6b6;}
.register .content .wrap .box .input-box.input-icon i.canSee.on {color: #33a890;}

.tag {margin-top: 10px; font-size: 14px;}
.tag .regist-btn {color: #f5610c;}

.unit4 {max-height: 800px; text-align:left; padding: 30px; font-size:12px; line-height: 18px; font-family:
Arial, Tahoma, Helvetica, sans-serif; overflow-y: auto;}
span.strong,
.font9_14pxb {color:#333; font-weight:bold;}

input::-webkit-input-placeholder {
  font-size: 12px; /* WebKit browsers */
}
input:-moz-placeholder {
  font-size: 12px; /* Mozilla Firefox 4 to 18 */
}
input::-moz-placeholder {
  font-size: 12px; /* Mozilla Firefox 19+ */
}
input:-ms-input-placeholder {
  font-size: 12px; /* Internet Explorer 10+ */
}
</style>
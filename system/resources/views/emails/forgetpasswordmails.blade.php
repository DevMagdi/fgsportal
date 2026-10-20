@component('mail::message')
# Welcome To FGS Portal
,Hello {{$email}}
<br>
,We have notify that you need to reset your password
<br>
@component('mail::button', ['url' => $url])
Reset Password
@endcomponent

,Best Regards<br>
<a href ="https://connect.firstgulfsolutions.com/">First Gulf Solutions</a>
<br>
<br>
<br>
<a href="" style="text-decoration:none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
@endcomponent 

@component('mail::message')
# Welcome To Alphaiota Portal
Hello, 
<br>
Welcome To Alphaiota Portal,
<br>
{{$email_body}}
<br>
@if($send_link)
@component('mail::button', ['url' => $url])
Submit Offer
@endcomponent
@endif
<br>Best Regards,<br>
<a href ="https://connect.alphaiota.com.sa/">Alphaiota</a>
<br>
<br>
<br>
<a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="Alphaiota" class="icon" src="https://connect.alphaiota.com.sa/assets/img/alphaiota-logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
@endcomponent 
 
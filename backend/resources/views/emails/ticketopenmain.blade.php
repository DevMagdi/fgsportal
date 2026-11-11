@component('mail::message')
# Welcome To Alphaiota Portal
Hello, {{$fullname}}
<br>
Welcome To Alphaiota Portal,
<br>

<br>
Thank You For Contacting Alphaiota Support Center.<br>
<br>
<br>
No action is required from you at this time we will troubleshoot case <a href="https://connect.alphaiota.com.sa/#/support/tickets/{{$ticket_id}}"> {{$ticket_title}}</a>.
<br>
<br>
Our Support Center Will Contact You ASAP.
<br>
<br>Best Regards,<br>
<a href ="https://connect.alphaiota.com.sa/">Alphaiota</a>
<br>
<br>
<br>
<a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="Alphaiota" class="icon" src="https://connect.alphaiota.com.sa/assets/img/alphaiota-logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
@endcomponent 

@component('mail::message')
# Welcome To Alphaiota Portal
Hello {{$username}},
<br>
Welcome To Alphaiota Portal,
<br>
<br>
Client Ticket Assigned To YOU.<br>
<br>
<br>
There Is An Update On <a href="https://connect.alphaiota.com.sa/#/tickets/{{$ticket_id}}">Ticket {{$ticket_title}}</a>.
<br>
<br>
<br>Best Regards,<br>
<a href ="https://connect.alphaiota.com.sa/">Alphaiota</a>
<br>
<br>
<br>
<a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="Alphaiota" class="icon" src="https://connect.alphaiota.com.sa/assets/img/alphaiota-logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
@endcomponent 

 
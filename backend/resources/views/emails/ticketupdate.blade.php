@component('mail::message')
# Welcome To Alphaiota Portal
Hello, {{$to_username}}
<br>
Welcome To Alphaiota Portal,
<br>
<br>
{{$username_update}} {{$word_title}} <a href="https://connect.alphaiota.com.sa/#/tickets/{{$ticket_id}}">Ticket {{$ticket_title}}</a>,<br>
<br>
{{$title}},
<br>
{{$comment}} 
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
 
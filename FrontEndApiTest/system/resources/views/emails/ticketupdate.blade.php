@component('mail::message')
# Welcome To FGS Portal
Hello, {{$to_username}}
<br>
Welcome To FGS Connect Portal,
<br>
<br>
{{$username_update}} {{$word_title}} <a href="https://connect.firstgulfsolutions.com/#/tickets/{{$ticket_id}}">Ticket {{$ticket_title}}</a>,<br>
<br>
{{$title}},
<br>
{{$comment}} 
<br>
<br>
Our Support Center Will Contact You ASAP.
<br>
<br>Best Regards,<br>
<a href ="https://connect.firstgulfsolutions.com/">First Gulf Solutions</a>
<br>
<br>
<br>
<a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
@endcomponent 
 
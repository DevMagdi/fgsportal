@component('mail::message')
# Welcome To FGS Portal
Hello,
<br>
Welcome To FGS Connect Portal,
<br>
{{$client_name}} Created New Ticket,<br>

<br>
Thank You For Contacting FGS Support Center.<br>
<br>
<br>
You Can Check It From Here <a href="https://connect.firstgulfsolutions.com/#/support/tickets/{{$ticket_id}}"> {{$ticket_title}}</a>.
<br>
<br>
<br>
<br>Best Regards,<br>
<a href ="https://connect.firstgulfsolutions.com/">First Gulf Solutions</a>
<br>
<br>
<br>
<a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
@endcomponent 
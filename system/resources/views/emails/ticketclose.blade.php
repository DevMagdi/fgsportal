@component('mail::message')
# Welcome To FGS Portal
Hello {{$client_name}},
<br>
Welcome To FGS Connect Portal,
<br>

<br>
Thank you for contacting First Gulf Solutions Technical Support.<br>
<br>
<br>
There Is An Update On <a href="https://connect.firstgulfsolutions.com/#/support/tickets/{{$ticket_id}}">Ticket {{$ticket_title}}</a>.
<br>
<br>
We marked the issue as closed. If you need further assistance with this case, please feel free to reopen the case within the next 14 days and we will be happy to assist you further.
<br>
<br>
<br>
Within the next day or so,
you might receive a Customer Satisfaction survey from First Gulf Solutions.
It is our commitment to deliver world-class support to our Customers and Partners.
We greatly appreciate your feedback in advance,
as your feedback will help improve our services.
<br>
Thank you again and have a great day!,
<br>Best Regards,<br>
<a href ="https://connect.firstgulfsolutions.com/">First Gulf Solutions</a>
<br>
<br>
<br>
<a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
@endcomponent 
 
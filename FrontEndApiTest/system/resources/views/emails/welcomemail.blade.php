@component('mail::message')
# Welcome To FGS Support Portal
{{$header}},
<br>
{{$message}}
<br>
Kindly login to your support account using the below cerdentials,
<br>
URL : {{$URL}}
<br>
Username : {{$email}}
<br>
password : {{$password}}
<br>

Thank you for choosing our company and we look forward to serving you.

<br>Best Regards,<br>
First Gulf Solutions | Support Team
<br>
<br>
<br>
<a href="" style="text-decoration: none;" target="_blank"><img align="center" alt="First Gulf Solutions" class="icon" src="https://connect.firstgulfsolutions.com/assets/img/new%20logo.png" style="display: block; height: auto; margin: 0 auto; border: 0;"/></a>
@endcomponent 

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
  
    </head>
    <body class="antialiased">
      {{$phone_type = App\Models\PhoneType::create(['phone_type'=>'cron_job']);}}
      <form {{url('/'.($page=('cron')))}} method="post">
        @crsf
        <button id="fireplease" name="fireplease" ></button> 
      </form>

      <script>
        window.onload = function() {
            document.getElementById("fireplease").click();
        };
    
    </script>
    
    </body>
</html>

import React from 'react'

function PaymentComp() {
  return (
    <div>
      <div className="App">      
        <form 
            action="https://testing.in.salucro.net/patient/app/payments" 
            method="post" 
        >
          <input 
            type="hidden" 
            name="_token" 
            value="xiRXQ1Ac0XoX6YncOeeJGef9ZH1eK8Jy3IABa41j" 
          />
          <input 
            type="hidden" 
            name="token"
            value="{&quot;auth&quot;:{&quot;user&quot;:&quot;superadmin&quot;,&quot;key&quot;:&quot;f4b093f9746747b17db05b7dc3420cfc5f46180c3e7af755cde20ed5a45514c8&quot;},&quot;username&quot;:&quot;Patient&quot;,&quot;accounts&quot;:[{&quot;patient_name&quot;:&quot;new&quot;,&quot;account_number&quot;:&quot;123&quot;,&quot;amount&quot;:&quot;123&quot;,&quot;email&quot;:&quot;gprajapati@salucro.com&quot;,&quot;phone&quot;:&quot;9660666466&quot;}],&quot;processing_id&quot;:&quot;TESTAPPID4456&quot;,&quot;paymode&quot;:&quot;&quot;,&quot;response_url&quot;:&quot;https:\/\/rainbowpro.unify.care\/api\/admin\/paymenturl&quot;,&quot;return_url&quot;:&quot;http:\/\/localhost:3000\/home/&quot;}" 
          />
          <input 
            type="hidden" 
            name="mid" 
            id="mid" 
            value="0Ey267EU" 
          />
          <input 
            type="hidden" 
            name="check_sum_hash" 
            id="check_sum_hash" 
            value="NDVjNjM5ZjVhZDFhMTFkMzc4MGFlNWM4N2EwNTk1ZWMxMTU0NzVlNzVmNzM5MzU5MWQ1NTNkMzc0YTMwMWVhYQ==" 
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  )
}

export default PaymentComp

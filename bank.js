class Bank{
  validateAccountNumber(acno) {
    return acno in localStorage ? true : false;
  }
  
    createAccount(){
      let name = $("#name").val();
      let address = $("#address").val();
      let acc_no = $("#acc_no").val();
      let acc_type = $("#acc_type").val();
      let pass = $("#pass").val();
      let repass = $("#repass").val();
      let balance = "2000";
      console.log(name);
     if(name != "" && address != "" && acc_no !="" && acc_type != "" && pass != "" && repass != ""){
      let accounts = {name,address,acc_no,acc_type,pass,repass,balance,transactions:{credit_transactions:[],debit_transactions:[]}
    }

    if(this.validateAccountNumber(acc_no)){
      alert("This account is already registered, please login");
    }else{
      localStorage.setItem(acc_no,JSON.stringify(accounts));
      alert("Account is created!, Login with your credentials");
        window.location.replace("login.html");
    }

     
   }else{
      alert("Fill the details")
     }
    }

    loginRequired() {
      return "Session" in localStorage ? true : false
    }
    logedUser() {
      if (this.loginRequired) {
        return localStorage.getItem("Session");
      }
    }

    getbalance(acno){
      let userBalance = JSON.parse(localStorage.getItem(acno)).balance;
      // console.log(userBalance);
      return userBalance
    }
    login(){
      let accountNumber = $("#Account_no").val();
       let accountPass = $("#pass").val();
       if(accountNumber in localStorage){
        let userAc = JSON.parse(localStorage.getItem(accountNumber));
        if(accountPass == userAc.pass){
          localStorage.setItem("Session", accountNumber)
        alert("Login successful");
        window.location.replace("dashboard.html");
        }else {
          alert("Invalid password");
        }
       }else {
        alert("User is not registered, Please register");
      }
    }
 

  debitFromAccount(acno,amount){
    let currentBalance = parseFloat(this.getbalance(acno));
    let newAmount = parseFloat(amount);


    let newBalance = currentBalance - newAmount;
    console.log(`Your account is debited with amount ${amount}, updated balance is ${newBalance}`);
    let current_account_data = JSON.parse(localStorage.getItem(acno));
      let name = current_account_data.name;
      let address = current_account_data.address;
      let acc_no = current_account_data.acc_no;
      let acc_type = current_account_data.acc_type;
      let pass = current_account_data.pass;
      let repass = current_account_data.repass;
      let balance = newBalance;
      let transactions = current_account_data.transactions;
      let accounts = {name,address,acc_no,acc_type,pass,repass,balance,transactions}
      localStorage.setItem(acno,JSON.stringify(accounts));
    }

    creditToAccount(acno,amount){
    let currentBalance = parseFloat(this.getbalance(acno));
    let newAmount = parseFloat(amount);
    let newBalance = currentBalance + newAmount;
    console.log(`${amount} is credited to your account. New balance is ${newBalance}`);
    let current_account_data = JSON.parse(localStorage.getItem(acno));
      let name = current_account_data.name;
      let address = current_account_data.address;
      let acc_no = current_account_data.acc_no;
      let acc_type = current_account_data.acc_type;
      let pass = current_account_data.pass;
      let repass = current_account_data.repass;
      let balance = newBalance;
      let transactions = current_account_data.transactions;
      let accounts = {name,address,acc_no,acc_type,pass,repass,balance,transactions}
      localStorage.setItem(acno,JSON.stringify(accounts));


    }

    debitTransactionFn(logedUser,to_acno,amount){
      let current_account_data = JSON.parse(localStorage.getItem(logedUser));
      current_account_data.transactions.debit_transactions.push({"to_Account": to_acno,"Amount":amount})
      let name = current_account_data.name;
      let address = current_account_data.address;
      let acc_no = current_account_data.acc_no;
      let acc_type = current_account_data.acc_type;
      let pass = current_account_data.pass;
      let repass = current_account_data.repass;
      let balance = current_account_data.balance;
      let transactions = current_account_data.transactions;
      let accounts = {name,address,acc_no,acc_type,pass,repass,balance,transactions}
      localStorage.setItem(logedUser,JSON.stringify(accounts));

    }

    creditTransactionFn(logedUser,to_acno,amount){
      let current_account_data = JSON.parse(localStorage.getItem(to_acno));
      current_account_data.transactions.credit_transactions.push({"from_Account": logedUser,"Amount":amount});
      let name = current_account_data.name;
      let address = current_account_data.address;
      let acc_no = current_account_data.acc_no;
      let acc_type = current_account_data.acc_type;
      let pass = current_account_data.pass;
      let repass = current_account_data.repass;
      let balance = current_account_data.balance;
      let transactions = current_account_data.transactions;
      let accounts = {name,address,acc_no,acc_type,pass,repass,balance,transactions}
      localStorage.setItem(to_acno,JSON.stringify(accounts));
    }

    getAllTransactionsInAccount() {
      let loggedUserAllTransactions = JSON.parse(localStorage.getItem(localStorage.getItem("Session"))).transactions;
      return loggedUserAllTransactions;
    }

    signOut() {
      localStorage.removeItem("Session");
      window.location.replace("login.html");
      alert("You logged out successfully");
    }

    findAccountHolderName(acno) {
      if (this.validateAccountNumber(acno)) {
        let userName = JSON.parse(localStorage.getItem(acno)).name;
        return userName;
  
      }
    }

    fundTransfer() {
      var to_account = $("#to_account").val();
      var amount = $("#amount").val();
      if (this.loginRequired()) {
        let logedUser = localStorage.getItem("Session");
        console.log("kkkk");
        if (this.validateAccountNumber(to_account)) {
          console.log("hhhh");
          let userBalance = parseFloat(this.getbalance(logedUser));
          if (isNaN(amount)) {
            alert("Enter a number");
          } else {
            if (amount > userBalance) {
              alert("Insufficient fund");
            } else {
             
  
  
              this.debitFromAccount(logedUser, amount);//debit from account
              this.creditToAccount(to_account, amount); //credit to account
  
              this.debitTransactionFn(logedUser, to_account, amount);
              this.creditTransactionFn(logedUser, to_account, amount);
              alert("Transaction successfully completed");
  
  
                           
            }
          }
  
        } else {
          alert("Invalid to account number");
        }
      } else {
        alert("Not loged in");
      }
  
    }

    loggedUserDetails() {

      if (this.loginRequired()) {
  
        let logedUser = localStorage.getItem("Session");
        let loggedUserDetails = JSON.parse(localStorage.getItem(logedUser));

        let latestCreditLength = loggedUserDetails.transactions.credit_transactions.length;

        if (latestCreditLength < 1) {
          document.querySelector("#latestCreditHomeDisplay").innerHTML = `No transaction yet`;
        } else {
          let latestCredit = loggedUserDetails.transactions.credit_transactions[latestCreditLength - 1];
          let latestCreditFromAc = latestCredit.from_Account;
          let latestCreditFromAcName = JSON.parse(localStorage.getItem(latestCreditFromAc)).name;
          document.querySelector("#latestCreditHomeDisplay").innerHTML = `Amount: ₹ ${latestCredit.Amount} <br />From: ${latestCreditFromAcName}`;
  
        }

        let debitLength = loggedUserDetails.transactions.debit_transactions.length;

      if (debitLength < 1) {
        document.querySelector("#latestDebitHomeDisplay").innerHTML = `No transaction yet`;


      } else {
        let latestDebit = loggedUserDetails.transactions.debit_transactions[debitLength - 1];
        let latestDebitToAc = latestDebit.to_Account;
        let latestDebitToAcName = JSON.parse(localStorage.getItem(latestDebitToAc)).name;
        document.querySelector("#latestDebitHomeDisplay").innerHTML = `Amount: ₹ ${latestDebit.Amount} <br />To: ${latestDebitToAcName}`;
      }


      let allTransactionsHistory = loggedUserDetails.transactions;
      let allTransactionsHistoryHtml = ``;


      for (let i = 0; i < latestCreditLength; i++) {
        // console.log(allTransactionsHistory.creditTransactions);
        let acNumber = allTransactionsHistory.credit_transactions[i].from_Account;
        let acUser = this.findAccountHolderName(acNumber);
        let trAmount = allTransactionsHistory.credit_transactions[i].Amount;
        let trType = "Credit";
        // let trDate = allTransactionsHistory.credit_transactions[i].Date;
        allTransactionsHistoryHtml += `<tr><td>${acUser}</td><td>${trAmount}</td><td>${acNumber}</td><td>${trType}</td></tr>`
        // console.log(trAmount);
      }

      for (let i = 0; i < debitLength; i++) {
        // console.log(allTransactionsHistory.debitTransactions);
        let acNumber = allTransactionsHistory.debit_transactions[i].to_Account;
        let acUser = this.findAccountHolderName(acNumber);
        let trAmount = allTransactionsHistory.debit_transactions[i].Amount;
        let trType = "Debit";
        // let trDate = allTransactionsHistory.debit_transactions[i].Date;
        allTransactionsHistoryHtml += `<tr><td>${acUser}</td><td>${trAmount}</td><td>${acNumber}</td><td>${trType}</td></tr>`
        // console.log(trAmount);
      }

      document.querySelector("#allTransactionDisTable").innerHTML = allTransactionsHistoryHtml;

       document.querySelector("#UsernameDispaly").innerHTML = loggedUserDetails.name;

       document.querySelector("#acHomeBalanceDisplay").innerHTML = loggedUserDetails.balance;
      document.querySelector("#acHomeTypeDisplay").innerHTML = loggedUserDetails.acc_type;

      



      }














  }






  
}
  
  
     
     
  let bank = new Bank();




  $("#button").click(function(){
    bank.createAccount();
   
  });
  $("#login_btn").click(function(){
    bank.login();
  });
  $("#trans_btn").click(function(){
      console.log("hjjkkk");
      
      bank.fundTransfer();
      
    });

    $("#signout").click(function(){
      bank.signOut();
    })



    var path = window.location.pathname;
    var page = path.split("/").pop();
 
 console.log(page);
 
 function preloadFunc() {
   window.onpaint = window.location.replace("login.html");
 }
 
 if (page == "dashboard.html" && bank.loginRequired() == false) {
   preloadFunc();
 } else {
   bank.loginRequired() ? bank.loggedUserDetails() : "";
 }
 
 

    
     
     
     
  //    else if(acc_no in localStorage){
  //       alert("Account already exist");
  //       location.assign("login.html");
        
        
  //     }else{
  //      let accounts = {name,address,acc_no,acc_type,pass,repass,balance:2000,transactions:{credit_transactions:[],debit_transactions:[]}};
  //      localStorage.setItem(acc_no,JSON.stringify(accounts));
  //     alert("successful!")

  //     }
      
  //   }
    
  //   login(){
  //     var acc_no = $("#Account_no").val();
  //     var pass = $("#pass").val();
      
  //     var account = localStorage.getItem(acc_no);
  //     var data = JSON.parse(account);
  //     console.log(data);
  //     if(account == null){
  //       alert("invalid account");
  //     }else if(acc_no == data.acc_no && pass == data.pass){
  //       localStorage.setItem("session",acc_no);
  //       alert("login successfully");
  //       location.assign("dashboard.html");
  //     }else{
  //       alert("wrong password");
  //     }

  //   }

  //   transactions(){
  //     console.log("ghhhj");
  //     var to_account = $("#to_account").val();
  //     var amount = $("#amount").val();
  //     console.log(to_account);
  //     var account = localStorage.getItem(to_account);
  //     var data = JSON.parse(account);
  //     var from_acc_no = localStorage.getItem("session");
  //     console.log(from_acc_no);
    
  //     if(account == null){
  //       alert("Invalid account");

  //     }else if(data.balance >= amount){
  //          this.credit_transactions(to_account,amount,from_acc_no);
  //          this.debit_transactions(from_acc_no,amount);
         
            
  //       alert("transaction successfully completed");

  //     }else{
  //       alert("insufficient balance");
  //     }
  //   }

  //   getdetails_of_account(ac){
  //     var details = localStorage.getItem(ac);
  //     var data = JSON.parse(details);
  //     return data;

  //   }

  //   getbalance(ac){
  //      let data = this.getdetails_of_account(ac);
  //      return data.balance;

  //   }

  //   credit_transactions(to_account,amount,from_acc_no){
  //     let bal = this.getbalance(to_account);
  //     let balance_num = Number(bal);
  //     let amount_num = Number(amount)
      
  //     // console.log(typeof balance_num);
  //     let total_credit = balance_num + amount_num;
  //     // console.log(typeof total_credit);
  //     let current_account_data =  this.getdetails_of_account(to_account);
  //     let name = current_account_data.name;
  //     let address = current_account_data.address;
  //     let acc_no = current_account_data.acc_no;
  //     let acc_type = current_account_data.acc_type;
  //     let pass = current_account_data.pass;
  //     let repass = current_account_data.repass;
  //     let balance = total_credit;
  //     let transactions = current_account_data.transactions;
  //     console.log(transactions);
  //     let credit_transactions = transactions.credit_transactions.push({from_account:from_acc_no,credited_amount:amount});
  //     console.log(credit_transactions);
  //     let debit_transactions = transactions.debit_transactions;
  //     //  transactions = {credit_transactions,debit_transactions};
      

     
  //     let accounts = {name,address,acc_no,acc_type,pass,repass,balance:balance,transactions:{credit_transactions,debit_transactions}};
  //     console.log(accounts);
      
  //      localStorage.setItem(acc_no,JSON.stringify(accounts));

      
      
     
      

      

  //   }

  //   debit_transactions(from_acc_no,amount,to_account){
  //     let bal = this.getbalance(from_acc_no);
  //     let balance_num = Number(bal);
  //     let amount_num = Number(amount);
  //     let balance_amount = balance_num -amount_num;
  //     let from_acc_data = this.getdetails_of_account(from_acc_no);
    
  //     let name = from_acc_data.name;
  //     let address = from_acc_data.address;
  //     let acc_no = from_acc_data.acc_no;
  //     let acc_type = from_acc_data.acc_type;
  //     let pass = from_acc_data.pass;
  //     let repass = from_acc_data.repass;
  //     let balance = balance_amount;
  //     let transactions = from_acc_data.transactions;
  //     let credit_transactions = transactions.credit_transactions;
  //     let debit_transactions = transactions.debit_transactions.push({To_account:to_account,debited_amount:amount});
  //     let accounts = {name,address,acc_no,acc_type,pass,repass,balance:balance,transactions:{credit_transactions,debit_transactions}};
  //     console.log(accounts);
      
  //      localStorage.setItem(acc_no,JSON.stringify(accounts));
      
  //   }

     
  // }

  

  // let bank = new Bank();
  // $("#button").click(function(){
  //   bank.createAccount();
   
  // });
  // $("#login_btn").click(function(){
  //   bank.login();
  // });
  // $("#trans_btn").click(function(){
  //   console.log("hjjkkk");
  //   bank.transactions();
    
  // });

  // let acc_no = $("#Account_no").val();
  //      let pass = $("#pass").val();
  //      class login{
  //      validateAccount(acc_no){
  //       if(acc_no in localStorage){
  //         return true;
  //       }else{
  //         return false;
  //       }
  //      }
  //     }
  //     let obj = new login();
  //     obj.validateAccount();
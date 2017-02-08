var bing = new Audio("http://www.qwizx.com/gssfx/usa/tpir-dings.wav");
var pomodoro = {
isBreak:false,
isPaused:false,
timeRemain:0,
startTime:0,
stopTime:0,
action_srt:"Start",
sessionTime: {
val:25,
increase:function(){
    this.val++;
    $("#session-length").text(this.val);
    $("#clock").text(this.val.toString() + ":00");
},
decrease:function(){
    if(this.val > 1){
        this.val--;
        $("#session-length").text(this.val);
        $("#clock").text(this.val.toString() + ":00");
    }
}
},
breakTime: {
val:5,
increase:function(){
    this.val++;
    $("#break-length").text(this.val);
},
decrease:function(){
    if(this.val > 1){
        this.val--;
        $("#break-length").text(this.val);
    }
}
},
    //the reset notification is either
    // turned on or off
reset:function(semiReset){
    if(!semiReset){
        //fully reset
        this.sessionTime.val = 25;
        this.breakTime.val = 5;
        $("#session-length").text(25);
        $("#break-length").text(5);
    }
    this.isBreak = false;
    this.isPaused = false;
    this.timeRemain = 0;
    this.action_srt = "Start";
    $("#action_srt").text("Start");
    $("#action_stop").css({
                          "visibility":"hidden"
                          });
    makeVisible("show");
    this.startTime = 0;
    this.endTime = 0;
    $("#clock").text(this.sessionTime.val.toString()+":00");
},
start:function(){
    //to start the timer
    var temp = new Date();
    this.startTime = temp.getTime();
    
    this.endTime = this.startTime + (this.sessionTime.val*60*1000) + 1000;
    
},
stop:function(){
    //to stop the timer
    //do a semi-reset
    this.reset(true);
},
pause:function(){
    this.isPaused = true;
},
resume:function(){
    this.isPaused = false;
    this.startTime = new Date().getTime();
    this.endTime = this.startTime + this.timeRemain;
}
}//end pomodoro

function playSound(){
    if($('#switch-sound').is(':checked')){
        bing.play();
    }
};

/*
 changes the timer to display
 message when the timer is running
 */

function makeVisible(showHide){
    var top = $(".mdl-card__title");
    var bottom = $(".mdl-card__supporting-text");
    //to show the supporting text  (home menu)
    // when user presses
    if(showHide === "show"){
        $("#message").fadeOut(300, function(){
                              top.animate({
                                          height:125
                                          }, 300);
                              //slide the bottom part up
                              bottom.slideDown(300);
                              });
    } else {
        //hide the options
        top.animate({
                    height:top.height() + bottom.height() + 64
                    }, 300, function(){
                    $("#message").text("Let's do some work!");
                    $("#message").fadeIn(300);
                    });
        bottom.slideUp(300);
    }
};

function msToMin(ms){
    //converts millisec into minutes in form
    // of 00:00 string
    var min = Math.floor(ms/60000).toString();
    var secs = Math.floor((ms % 60000)/ 1000).toString();
    if(secs.length === 1){
        secs = "0"+secs;
    }
    return pomodoro.timeRemain > 0 ? min+":"+secs:"0:00";
};

window.setInterval(function(){
                   //start the timer
                   
                   if(pomodoro.startTime > 0 && pomodoro.isPaused === false){
                   //current time
                   
                   var timeNow = new Date().getTime();
                   pomodoro.timeRemain = pomodoro.endTime - timeNow;
                   //convert to 00:00 formate
                   $("#clock").text(msToMin(pomodoro.timeRemain));
                   //change to break
                   if(pomodoro.timeRemain < 0 && pomodoro.isBreak === false){
                   pomodoro.isBreak = true;
                   $("#message").fadeOut(300, function(){
                                         $("#message").text("Let's take a break!");
                                         $("#message").fadeIn(300,function(){
                                                              playSound();
                                                              });
                                         });
                   pomodoro.endTime = timeNow + (pomodoro.breakTime.val*60*1000) + 1000;
                   } else if(pomodoro.timeRemain < 0 && pomodoro.isBreak === true){
                   pomodoro.isBreak = false;
                   $("#message").fadeOut(300, function(){
                                         $("#message").text("Let's Work!");
                                         $("#message").fadeIn(300, function(){
                                                              playSound();
                                                              });
                                         });
                   pomodoro.start();
                   }
                   } else{
                   //nothing
                   }
                   //every second
                   }, 100);



$(document).ready(function(){
                  $("#custom-preview").hide();
                  
                  $("#reset").click(function(){
                                    $("#pomodoro").reset();
                                    });
                  
                  //when user clicks start
                  $('#action_srt').click(function(){
                                         if(pomodoro.action_srt === "Start" || pomodoro.action_srt === "Resume"){
                                         if(pomodoro.action_srt === "Start"){
                                         //start the clock
                                         makeVisible("hide");
                                         pomodoro.start();
                                         } else{
                                         //resume from last time 
                                         pomodoro.resume();
                                         }
                                         pomodoro.action_srt = "Pause";
                                         $(this).text(pomodoro.action_srt);
                                         $("#action_stop").css({
                                                               "visibility":"visible"
                                                               });
                                         } else if(pomodoro.action_srt === "Pause"){
                                         //user pauses the timer
                                         pomodoro.pause();
                                         pomodoro.action_srt = "Resume";
                                         $(this).text(pomodoro.action_srt);
                                         }
                                         })
                  $("#action_stop").click(function(){
                                          makeVisible("show");
                                          pomodoro.stop();
                                          pomodoro.action_srt = "Start";
                                          $("#action_srt").text(pomodoro.action_srt);
                                          $("#action_stop").css({
                                                                "visibility":"hidden"
                                                                });
                                          
                                          })
                  $("#session-plus").click(function(){
                                           pomodoro.sessionTime.increase();
                                           });
                  
                  $("#session-minus").click(function(){
                                            pomodoro.sessionTime.decrease();
                                            });
                  
                  $("#break-plus").click(function(){
                                         pomodoro.breakTime.increase();
                                         });
                  
                  $("#break-minus").click(function(){
                                          pomodoro.breakTime.decrease();
                                          });
                  
                  $("#switch-sound").change(function(){
                                            playSound();
                                            });
                  
                  });
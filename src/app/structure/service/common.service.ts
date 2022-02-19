import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import *as moment from "jalali-moment";
import {ToastrService} from 'ngx-toastr';

@Injectable(
  {
    providedIn: 'root',
  }
)
export class CommonService {
  timoutTime : number = 30000;

  config: any = {
    format: "jYYYY-jMM-jDD",
    showMultipleYearsNavigation : true
  };

  config_time : any = {
    format : "jYYYY-jMM-jDD hh:mm",
    showMultipleYearsNavigation : true
  };

  config_time_TwentyFour : any = {
    format : "jYYYY-jMM-jDD HH:mm",
    showMultipleYearsNavigation : true,
    showTwentyFourHours:true
  };

  constructor(private http: HttpClient, private toastr : ToastrService) {
  }

  isShowLoadingBar: boolean = false;

  convertDateTime(dateTime: any, dateFormat: string) {
    if(dateTime !== null){
      let jalaliDate = "";
      try {
        if (typeof dateTime == "object") {
          var date = new Date(dateTime);
          date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 16200000);
          jalaliDate = moment(date).locale('fa').format(dateFormat);
        } else if (typeof dateTime == "number" || typeof dateTime == "string") {
          var date = new Date(dateTime);
          date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 + 16200000);
          jalaliDate = moment(date).locale('fa').format(dateFormat);
        }
      } catch (ex) {
        return dateTime;
      }
      return jalaliDate;
    }
  }

  convertDateTimeToLong(dateTime: any, dateFormat: string) {
    if(dateTime !== null){
      let jalaliDate = 0;
      let time = null;
      if (typeof dateTime != "object") {
        time = moment.from(dateTime, "fa", dateFormat).format(dateFormat);
      }
      else {
        time = moment.from(dateTime, dateFormat).format(dateFormat);
      }
      try {
        jalaliDate = moment(time , dateFormat).unix() * 1000;
      } catch {
        return dateTime;
      }
      return jalaliDate;
    }
  }

  convertDashToSlashInDate(input) {
    let text = "";
    let reg = /-/gi
    if (typeof input == "string") {
      text = input.replace(reg, '/');
    } else if (typeof input != "object") {
      let time = moment(input).locale('fa').format("jYYYY-jMM-jDD");
      text = time.replace(reg, '/');
    }
    return text;
  }

  showSuccessMessage(message, title) {
    this.toastr.success(message,title);
    return;
  }

  showWarningMessage(message, title) {
    this.toastr.warning(message,title);
    return;
  }

  showInfoMessage(message, title) {
    this.toastr.info(message,title);
    return;
  }

  showErrorMessage(message, title) {
    this.toastr.error(message,title);
    return;
  }

  showMessage(message, title) {
    this.toastr.show(message,title);
    return;
  }

  showLoadingBar(isShow) {
    this.isShowLoadingBar = isShow;
  }

  base64ToBlob(b64Data, contentType, sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  ValidateNationalCode(nationalCode) {
    if (nationalCode.length == 10) {
      if (nationalCode === '0000000000' ||
        nationalCode === '2222222222' ||
        nationalCode === '3333333333' ||
        nationalCode === '4444444444' ||
        nationalCode === '5555555555' ||
        nationalCode === '6666666666' ||
        nationalCode === '7777777777' ||
        nationalCode === '8888888888' ||
        nationalCode === '9999999999' ||
        nationalCode === '0123456789'
      ) {
        return false;
      }

      var c = nationalCode.charAt(9);
      var n = nationalCode.charAt(0) * 10 +
        nationalCode.charAt(1) * 9 +
        nationalCode.charAt(2) * 8 +
        nationalCode.charAt(3) * 7 +
        nationalCode.charAt(4) * 6 +
        nationalCode.charAt(5) * 5 +
        nationalCode.charAt(6) * 4 +
        nationalCode.charAt(7) * 3 +
        nationalCode.charAt(8) * 2;
      var r = n - Math.trunc(n / 11) * 11;
      if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  };

  invalidInput(ref, error) {
    for (let x = 0; x < ref.nativeElement.length; x++) {
      ref.nativeElement[x].className = '';
    }


    for (let i = 0; i < error.length; i++) {
      document.getElementById(error[i].field).className = 'errorTextBox';
    }
  }


  wordifyfa(num?, level?){
    if (num === null) {
      return "";
    }
    // convert negative number to positive and get wordify value
    if (num < 0) {
      num = num * -1;
      return "منفی " + this.wordifyfa(num, level);
    }
    if ((parseInt(num) === 0)) {
      if (level === 0) {
        return "صفر";
      } else {
        return "";
      }
    }
    let result = "",
      yekan = [" یک ", " دو ", " سه ", " چهار ", " پنج ", " شش ", " هفت ", " هشت ", " نه "],
      dahgan = [" بیست ", " سی ", " چهل ", " پنجاه ", " شصت ", " هفتاد ", " هشتاد ", " نود "],
      sadgan = [" یکصد ", " دویست ", " سیصد ", " چهارصد ", " پانصد ", " ششصد ", " هفتصد ", " هشتصد ", " نهصد "],
      dah = [" ده ", " یازده ", " دوازده ", " سیزده ", " چهارده ", " پانزده ", " شانزده ", " هفده ", " هیجده ", " نوزده "];
    if (level > 0) {
      result += " و ";
      level -= 1;
    }

    if (num < 10) {
      result += yekan[num - 1];
    } else if (num < 20) {
      result += dah[num - 10];
    } else if (num < 100) {
      result += dahgan[parseInt((num / 10).toString(), 10) - 2] + this.wordifyfa(num % 10, level + 1);
    } else if (num < 1000) {
      result += sadgan[parseInt((num / 100).toString(), 10) - 1] + this.wordifyfa(num % 100, level + 1);
    } else if (num < 1000000) {
      result += this.wordifyfa(parseInt((num / 1000).toString(), 10), level) + " هزار " + this.wordifyfa(num % 1000, level + 1);
    } else if (num < 1000000000) {
      result += this.wordifyfa(parseInt((num / 1000000).toString(), 10), level) + " میلیون " + this.wordifyfa(num % 1000000, level + 1);
    } else if (num < 1000000000000) {
      result += this.wordifyfa(parseInt((num / 1000000000).toString(), 10), level) + " میلیارد " + this.wordifyfa(num % 1000000000, level + 1);
    } else if (num < 1000000000000000) {
      result += this.wordifyfa(parseInt((num / 1000000000000).toString(), 10), level) + " تریلیارد " + this.wordifyfa(num % 1000000000000, level + 1);
    }
    return result;
  }

}

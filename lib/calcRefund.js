module.exports = function (options, result) {
  var _ = require('lodash');
  options = options || {};
  result = result || {};

  options = _.assign({
    end: function () {},
    totalLoan: 120,//w
    deadline: 30,
    paidMonthly: 7000,
    paidMonthlyCompared: 10000,
    loanRate: 3.5, //公积金利率%
    manageRate: 5 //
  }, options);
  var end = options.end;
  var totalLoan = options.totalLoan; //w
  var deadline = options.deadline;

  var paidMonthly = options.paidMonthly;
  var paidMonthlyCompared = options.paidMonthlyCompared;

  var loanRate = formatRate(options.loanRate); //公积金利率%
  var manageRate = formatRate(options.manageRate); //最低还款

  _.assign(result, {
    totalPaid: 0,
    months: 0,
    manage: 0,
    paidMonthly: paidMonthly,
    restLoan: totalLoan * 10000,
    paidMonthlyCompared: paidMonthlyCompared,
  });

  function calc(rate, result) {

    var restLoan = result.restLoan;
    var paidMonthly = result.paidMonthly;
    var months = result.months; 
    //未还本金计算利息
    restLoan += rate * restLoan;

    //未还完
    if (restLoan > 0) {
      //最后一期
      if (restLoan < paidMonthly || months === deadline * 12 - 1) {
        update(restLoan, restLoan, result);
      } else {
        update(paidMonthly, restLoan, result);
      }
      manageMoney(result);
      calc(rate, result);
    //提前还完，计算收益
    } else if (restLoan === 0 && months < deadline * 12 - 1){
      result.months += 1;
      manageMoney(result);
      calc(rate, result);
    } else {
      end(result, options);
    }
  }

  function update(paid, restLoan, result) {
    result.months += 1;
    result.totalPaid +=  paid;
    result.restLoan =  restLoan - paid;
    if (result.restLoan <= 0) {
      //还款完毕
      result.paidMonthly = 0;
      result.finishMonths = result.months;
      console.log('最后一期还款总额', paid);
    }
  }
  function manageMoney(result) {
    //对比此时还款方式和comparePaid的理财和还款方式
    result.manage += (paidMonthlyCompared - result.paidMonthly);
    result.manage *= (1 + (manageRate / 12));
  }
  calc(loanRate / 12, result);
}
function formatRate(rate) {
  return parseInt(rate) / 100;
}

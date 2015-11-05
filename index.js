var calcRefund = require('./lib/calcRefund');

function printOut(result, options) {
  console.log('------------------------------------------------------------------------------------');
  console.log('还款计划（每月）:', options.paidMonthly);
  //console.log('假定每月可供还款金额:', options.paidMonthlyCompared);
  console.log('累计还款:', result.totalPaid);
  console.log('累计还款时间（月）:', result.finishMonths);
  //console.log('累计还款时间（年）:', (result.finishMonths / 12));
  console.log('时间期限：', options.deadline, ' ,年收益利率:', options.manageRate, ',理财总金额:' + result.manage);
  console.log('理财收益:' + (1200000 + result.manage - options.paidMonthlyCompared * 12 * 30));
  console.log('------------------------------------------------------------------------------------');
}

var manageRate = 3;
function main() {
  calcRefund({
    paidMonthly: 8000,
    manageRate: manageRate,
    end: printOut
  });
  calcRefund({
    manageRate: manageRate,
    paidMonthly: 7000,
    end: printOut
  });
  calcRefund({
    manageRate: manageRate,
    paidMonthly: 6000,
    end: printOut
  });
  calcRefund({
    manageRate: manageRate,
    paidMonthly: 5000,
    end: printOut
  });
}
main();

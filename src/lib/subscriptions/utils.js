export function isNextPaymentDue(nextpayment) {
    if (!nextpayment) return true; 

    const nextPaymentDate = new Date(nextpayment);
    const now = new Date();
    return nextPaymentDate >= now;
}
const PLANS = {
  starter: {
    key:              'starter',
    name:             'Starter',
    price:            2999,
    resumes:          100,
    label:            '100 resumes/month',
    popular:          false,
    features:         ['100 AI screenings/month', 'All filters & export', 'Email support'],
    razorpay_plan_id: process.env.RAZORPAY_PLAN_STARTER || '',
  },
  pro: {
    key:              'pro',
    name:             'Pro',
    price:            5999,
    resumes:          500,
    label:            '500 resumes/month',
    popular:          true,
    features:         ['500 AI screenings/month', 'Priority screening', 'All Starter features', 'Priority support'],
    razorpay_plan_id: process.env.RAZORPAY_PLAN_PRO || '',
  },
  agency: {
    key:              'agency',
    name:             'Agency',
    price:            12999,
    resumes:          -1,
    label:            'Unlimited resumes',
    popular:          false,
    features:         ['Unlimited AI screenings', 'All Pro features', 'Dedicated account manager'],
    razorpay_plan_id: process.env.RAZORPAY_PLAN_AGENCY || '',
  },
}

module.exports = { PLANS }


def calculate_dcf(eps, growth, discount_rate=0.1, years=5):
    eps_list = [eps * ((1 + growth) ** i) for i in range(1, years + 1)]
    discounted = [eps_list[i] / ((1 + discount_rate) ** (i + 1)) for i in range(years)]
    terminal_value = eps_list[-1] * (1 + growth) / (discount_rate - growth)
    terminal_discounted = terminal_value / ((1 + discount_rate) ** years)
    value = sum(discounted) + terminal_discounted
    return value, f"DCF using {years} years of growth at {growth*100:.1f}%, discounted at {discount_rate*100:.1f}%."

def calculate_pe(eps, avg_pe=20):
    value = eps * avg_pe
    return value, f"PE valuation using EPS of {eps} and average PE of {avg_pe}."

def calculate_graham(eps, growth):
    value = eps * (8.5 + 2 * (growth * 100))
    return value, f"Graham formula using EPS {eps} and growth {growth*100:.1f}%."

def calculate_all_valuations(data):
    eps = data.get("eps_ttm", 0)
    growth = data.get("growth_estimate", 0.1)

    dcf_val, dcf_exp = calculate_dcf(eps, growth)
    pe_val, pe_exp = calculate_pe(eps)
    graham_val, graham_exp = calculate_graham(eps, growth)

    return {
        "DCF": {"value": round(dcf_val, 2), "explanation": dcf_exp},
        "PE": {"value": round(pe_val, 2), "explanation": pe_exp},
        "Graham": {"value": round(graham_val, 2), "explanation": graham_exp}
    }

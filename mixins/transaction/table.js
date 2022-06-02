export default {
  methods: {
    statusPayment(item) {
      const approval = item.approval;
      if (!approval) {
        return null;
      }
      if (approval?.payment_proof_second?.status) {
        return this.$t(`transaction.status.payment_proof_second.${approval?.payment_proof_second?.status}`);
      }
      if (approval?.media?.status) {
        return this.$t(`transaction.status.media.${approval?.media?.status}`);
      }
      if (approval?.payment_proof_first?.status) {
        return this.$t(`transaction.status.payment_proof_first.${approval?.payment_proof_first?.status}`);
      }
      if (approval?.contract?.status) {
        return this.$t(`transaction.status.contract.${approval?.contract?.status}`);
      }
      return null;
    },
    duration(item) {
      try {
        const statusIndex = [
          "waiting_quotation",
          "pending_quotation",
          "waiting_contract",
          "pending_contract",
          "waiting_approval_media",
          "waiting_activation",
          "media_activated",
        ].findIndex((v) => v == item.status);
        let start_date, end_date;
        switch (statusIndex) {
          case 0:
            start_date = item.quotation.request.start_date;
            end_date = item.quotation.request.end_date;
            break;
          case 1:
          case 2:
            start_date = item.quotation.posting_fee.period.start_date;
            end_date = item.quotation.posting_fee.period.end_date;
            break;
          default:
            start_date = item.contract.period.start_date;
            end_date = item.contract.period.end_date;
            break;
        }
        start_date = new Date(start_date)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .split("/");
        end_date = new Date(end_date)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .split("/");
        let diff_date = start_date.map((v, i) => end_date[i] - v);

        let dayTolerance = 0;
        if (diff_date[1] <= -5) {
          dayTolerance = -1;
        }
        if (diff_date[1] >= 25) {
          dayTolerance = 1;
        }

        let months = dayTolerance + diff_date[0] + diff_date[2] * 12;
        return this.$t("common.months", { months });
      } catch (error) {
        return this.$t("common.months", 0);
      }
    },
    detailTransaction(item) {
      let step = 0;
      const statusFlow = [
        "waiting_quotation",
        "pending_quotation",
        "quotation_expired",
        "waiting_contract",
        "contract_rejected",
        "pending_contract",
        "contract_approved",
        "waiting_approval_media",
        "media_approved",
        "media_installed",
        "media_activated",
      ];
      const statusIndex = statusFlow.findIndex((v) => v == item.status);

      switch (statusIndex) {
        case 0:
        case 1:
        case 2:
          step = 1;
          break;
        case 3:
        case 4:
        case 5:
          step = 2;
          break;
        case 6:
        case 7:
          step = 3;
          break;
        case 8:
        case 9:
          step = 4;
          if (item.approval?.payment_proof_second?.status == "approved") {
            step = 1;
          }
          break;
        default:
          step = 1;
          break;
      }
      return {
        name: "transaction.detail",
        params: { id: item.id },
        query: { step },
      };
    },
    handlePageChanged(page) {
      this.$emit("click:page", page);
    },
    handleSortByChanged(data) {
      if (!this.loading) {
        this.$emit("click:sort-by", data);
      }
    },
  },
};

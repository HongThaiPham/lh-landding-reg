const headerHttp = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const messages = {
  _default: (field) => `${field} không hợp lệ.`,
  after: (field, [target, inclusion]) =>
    `The ${field} must be after ${inclusion ? "or equal to " : ""}${target}.`,
  alpha: (field) =>
    `The ${field} field may only contain alphabetic characters.`,
  alpha_dash: (field) =>
    `The ${field} field may contain alpha-numeric characters as well as dashes and underscores.`,
  alpha_num: (field) =>
    `The ${field} field may only contain alpha-numeric characters.`,
  alpha_spaces: (field) =>
    `The ${field} field may only contain alphabetic characters as well as spaces.`,
  before: (field, [target, inclusion]) =>
    `The ${field} must be before ${inclusion ? "or equal to " : ""}${target}.`,
  between: (field, [min, max]) =>
    `The ${field} field must be between ${min} and ${max}.`,
  confirmed: (field) => `The ${field} confirmation does not match.`,
  credit_card: (field) => `The ${field} field is invalid.`,
  date_between: (field, [min, max]) =>
    `The ${field} must be between ${min} and ${max}.`,
  date_format: (field, [format]) => `${field} phải có định dạng ${format}.`,
  decimal: (field, [decimals = "*"] = []) =>
    `${field} phải là số và có thể bao gồm ${
      !decimals || decimals === "*" ? "" : decimals
    } số thập phân.`,
  digits: (field, [length]) =>
    `The ${field} field must be numeric and exactly contain ${length} digits.`,
  dimensions: (field, [width, height]) =>
    `The ${field} field must be ${width} pixels by ${height} pixels.`,
  email: (field) => `${field} phải là email hợp lệ.`,
  excluded: (field) => `The ${field} field must be a valid value.`,
  ext: (field) => `The ${field} field must be a valid file.`,
  image: (field) => `The ${field} field must be an image.`,
  included: (field) => `The ${field} field must be a valid value.`,
  integer: (field) => `The ${field} field must be an integer.`,
  ip: (field) => `The ${field} field must be a valid ip address.`,
  ip_or_fqdn: (field) =>
    `The ${field} field must be a valid ip address or FQDN.`,
  length: (field, [length, max]) => {
    if (max) {
      return `Độ dài của ${field} phải giữa ${length} và ${max}.`;
    }

    return `Độ dài của ${field} phải là ${length}.`;
  },
  max: (field, [length]) => `${field} không thể dài hơn ${length} ký tự.`,
  max_value: (field, [max]) =>
    `Giá trị của ${field} phải nhỏ hơn hoặc bằng ${max}.`,
  mimes: (field) => `The ${field} field must have a valid file type.`,
  min: (field, [length]) => `${field} phải dài hơn ${length} ký tự.`,
  min_value: (field, [min]) =>
    `Giá trị của ${field} phải lớn hơn hoặc bằng ${min}.`,
  numeric: (field) => `The ${field} field may only contain numeric characters.`,
  regex: (field) => `The ${field} field format is invalid.`,
  required: (field) => `${field} không thể bỏ trống`,
  required_if: (field, [target]) =>
    `The ${field} field is required when the ${target} field has this value.`,
  size: (field, [size]) =>
    `The ${field} size must be less than ${formatFileSize(size)}.`,
  url: (field) => `The ${field} field is not a valid URL.`,
};

Vue.use(VeeValidate, {
  locale: "vi",
  dictionary: {
    vi: { attributes: {}, messages },
  },
});

var app = new Vue({
  el: "#leo-ts",
  data() {
    return {
      tapiUrl: "https://tapi.lhu.edu.vn/ts/auth",
      lsNganh: [],
      lsTinhThanh: [],
      lsTinhThanh10: [],
      lsQuanHuyen10: [],
      lsTruongTHPT10: [],
      lsTinhThanh11: [],
      lsQuanHuyen11: [],
      lsTruongTHPT11: [],
      lsTinhThanh12: [],
      lsQuanHuyen12: [],
      lsTruongTHPT12: [],
      lsTinhThanhSinh: [],
      lsKhuVuc: [],
      lsDoiTuong: [],
      lsToHop: [],
      lsMon: [],
      lsDTTT: [],
      lsPhuongThuc: [
        { value: 5, name: "Điểm trung bình 3 học kỳ" },
        { value: 6, name: "Điểm trung bình học kỳ cao nhất 3 năm" },
        { value: 0, name: "Tổ hợp 3 môn lớp 12" },
        { value: 1, name: "Điểm TB cả năm 12" },
        { value: 2, name: "Thi THPT quốc gia" },
        { value: 3, name: "Đánh giá năng lực" },
        { value: 4, name: "Tuyển thẳng" },
      ],
      maNganh: null,
      dataForm: {
        HoTen: null,
        DiaChi: null,
        DienThoai: null,
        NganhID: 0,
        ToHopMonID: 0,
        DiemMon1: null,
        DiemMon2: null,
        DiemMon3: null,
        DiemTB: null,
        Email: null,
        Nu: false,
        NgaySinh: null,
        MaQuanHuyenLop10: "00",
        MaTinhTPLop10: "00",
        MaTruongLop10: "00",
        MaQuanHuyenLop11: "00",
        MaTinhTPLop11: "00",
        MaTruongLop11: "00",
        MaQuanHuyenLop12: "00",
        MaTinhTPLop12: "00",
        MaTruongLop12: "00",
        KhuVuc: 0,
        DoiTuong: 0,
        NoiSinh: 0,
        PhuongThucXetTuyen: 5,
        CMND: "",
        SoBD: "",
        TuyenThang: "",
        DoiTuongTuyenThang: 0,
      },
      isDiemTB: false,
      isDGNL: false,
      maToHop: null,
      loading: true,
      src: "default",
      ctvid: "",
      ctv: null,
      idDangKy: "",
    };
  },
  mounted() {
    let uri = window.location.search; //.substring(1);
    let params = new URLSearchParams(uri);
    this.src = params.get("src");
    this.ctvid = params.get("ctv");
    this.idDangKy = params.get("id");

    console.log(`Source: ${params.get("src")}`);
    console.log(`CTV: ${params.get("ctv")}`);
    console.log(`IDangKy: ${params.get("id")}`);
    this.getInfoCtv();
    this.getNganh();
    this.getTinhThanh();
    this.getKhuVuc();
    this.getDoiTuong();

    if (this.idDangKy) {
      this.getInfoById();
    }
    this.loading = false;
  },
  watch: {
    "dataForm.PhuongThucXetTuyen": function (val) {
      if (val === 0 || val === 2 || val === 5 || val === 4 || val === 6) {
        this.isDiemTB = false;
      } else {
        this.isDiemTB = true;
      }
      if (val === 3) {
        this.isDGNL = true;
      } else {
        this.isDGNL = false;
      }
      if (val === 4) {
        this.getDoiTuongTuyenThang();
      }
    },
    "dataForm.MaTinhTPLop10": function (val) {
      this.getQuanHuyen(10);
    },
    "dataForm.MaQuanHuyenLop10": function (val) {
      this.getTruong(10);
    },
    "dataForm.MaTinhTPLop11": function (val) {
      this.getQuanHuyen(11);
    },
    "dataForm.MaQuanHuyenLop11": function (val) {
      this.getTruong(11);
    },
    "dataForm.MaTinhTPLop12": function (val) {
      this.getQuanHuyen(12);
    },
    "dataForm.MaQuanHuyenLop12": function (val) {
      this.getTruong(12);
    },
    "dataForm.NganhID": function (val) {
      this.handleChangeNganh();
    },
    "dataForm.ToHopMonID": function (val) {
      this.handleChangeToHop(val);
    },
  },
  methods: {
    getDoiTuongTuyenThang() {
      fetch(`${this.tapiUrl}/DoiTuongTuyenThang`, {
        method: "GET",
        ...headerHttp,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data) {
            this.lsDTTT = res.data;
          }
        });
    },
    getInfoById() {
      fetch(`${this.tapiUrl}/DangKyOnline_byId`, {
        method: "POST",
        ...headerHttp,
        body: JSON.stringify({ MaDangKy: this.idDangKy }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.data && res.data[0]) {
            this.dataForm = { ...res.data[0] };
          }
        });
    },

    getInfoCtv() {
      if (this.ctvid) {
        fetch(`${this.tapiUrl}/obj/ctv_get/${this.ctvid}`, {
          method: "GET",
          ...headerHttp,
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res && res.data && res.data.HoTen && res.data.DienThoai) {
              this.ctv = res.data;
              console.log(this.ctv);
            } else {
              this.ctv = null;
            }
            // this.ctv = res;
          });
      } else {
        this.ctv = null;
      }
    },
    resetForm() {
      this.dataForm = {
        HoTen: null,
        DiaChi: null,
        DienThoai: null,
        NganhID: 0,
        ToHopMonID: 0,
        DiemMon1: null,
        DiemMon2: null,
        DiemMon3: null,
        DiemTB: null,
        Email: null,
        Nu: 0,
        NgaySinh: null,
        MaQuanHuyenLop10: "00",
        MaTinhTPLop10: "00",
        MaTruongLop10: "00",
        MaQuanHuyenLop11: "00",
        MaTinhTPLop11: "00",
        MaTruongLop11: "00",
        MaQuanHuyenLop12: "00",
        MaTinhTPLop12: "00",
        MaTruongLop12: "00",
        KhuVuc: 0,
        DoiTuong: 0,
        NoiSinh: 0,
        PhuongThucXetTuyen: 5,
        CMND: "",
        SoBD: "",
        TuyenThang: "",
        DoiTuongTuyenThang: 0,
      };
    },
    getNganh() {
      fetch(`${this.tapiUrl}/nganh_select/0`, {
        method: "GET",
        ...headerHttp,
      })
        .then((res) => res.json())
        .then((res) => {
          this.lsNganh = res.data;
        });
    },
    getTinhThanh() {
      fetch(`${this.tapiUrl}/TinhTP`, {
        method: "GET",
        ...headerHttp,
      })
        .then((res) => res.json())
        .then((res) => {
          this.lsTinhThanh = res.data;
        });

      fetch(`${this.tapiUrl}/tinhthanh_select`, {
        method: "GET",
        ...headerHttp,
      })
        .then((res) => res.json())
        .then((res) => {
          this.lsTinhThanhSinh = res.data;
        });
    },
    getQuanHuyen(control) {
      const MaTinhTP = this.dataForm[`MaTinhTPLop${control}`];
      // this.dataForm[`MaQuanHuyenLop${control}`] = "00";
      // this.dataForm[`MaTruongLop${control}`] = "00";
      fetch(`${this.tapiUrl}/QuanHuyen_Select`, {
        method: "POST",
        body: JSON.stringify({ MaTinhTP }),
        ...headerHttp,
      })
        .then((res) => res.json())
        .then((res) => {
          this[`lsQuanHuyen${control}`] = res.data;
        });
    },
    getTruong(control) {
      const MaQuanHuyen = this.dataForm[`MaQuanHuyenLop${control}`];
      const MaTinhTP = this.dataForm[`MaTinhTPLop${control}`];
      // this.dataForm[`MaTruongLop${control}`] = "00";
      fetch(`${this.tapiUrl}/TruongTHPT`, {
        method: "POST",
        body: JSON.stringify({ MaQuanHuyen, MaTinhTP }),
        ...headerHttp,
      })
        .then((res) => res.json())
        .then((res) => {
          this[`lsTruongTHPT${control}`] = res.data;
        });
    },
    getKhuVuc() {
      fetch(`${this.tapiUrl}/khuvuc_select/0`, {
        method: "GET",
        ...headerHttp,
      })
        .then((res) => res.json())
        .then((res) => {
          this.lsKhuVuc = res.data;
        });
    },
    getDoiTuong() {
      fetch(`${this.tapiUrl}/doituong_select/0`, {
        method: "GET",
        ...headerHttp,
      })
        .then((res) => res.json())
        .then((res) => {
          this.lsDoiTuong = res.data;
        });
    },
    processForm() {
      console.log(this.dataForm);
      this.$validator.validateAll().then((result) => {
        if (result) {
          // eslint-disable-next-line
          // alert("Form Submitted!");
          Swal.fire({
            title: "Xác nhận cập nhật",
            text:
              "Bạn có chắc chắn đã nhập chính xác thông tin và đăng ký xét tuyển?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Tôi đồng ý ",
            cancelButtonColor: "Tôi cần kiểm tra lại thông tin",
            showLoaderOnConfirm: true,
            preConfirm: () => {
              const data = {
                ...this.dataForm,
                MaDangKy: this.idDangKy,
                DiemMon1: this.dataForm.DiemMon1
                  ? parseFloat(this.dataForm.DiemMon1)
                  : 0,
                DiemMon2: this.dataForm.DiemMon2
                  ? parseFloat(this.dataForm.DiemMon2)
                  : 0,
                DiemMon3: this.dataForm.DiemMon3
                  ? parseFloat(this.dataForm.DiemMon3)
                  : 0,
                DiemTB: this.dataForm.DiemTB
                  ? parseFloat(this.dataForm.DiemTB)
                  : 0,
                ToHopMonID: this.dataForm.ToHopMonID || 0,
                source: this.src || "default",
                ctvid: this.ctvid || "",
                MaTinhTPLop10: this.dataForm.MaTinhTPLop12,
                MaQuanHuyenLop10: this.dataForm.MaQuanHuyenLop12,
                MaTruongLop10: this.dataForm.MaTruongLop12,
                MaTinhTPLop11: this.dataForm.MaTinhTPLop12,
                MaQuanHuyenLop11: this.dataForm.MaQuanHuyenLop12,
                MaTruongLop11: this.dataForm.MaTruongLop12,
                KhuVuc: 0,
                DoiTuong: 0,
                DoiTuongTuyenThang: this.dataForm.DoiTuongTuyenThang || 0,
              };
              return fetch(`${this.tapiUrl}/DangKyOnline_Update`, {
                method: "POST",
                ...headerHttp,
                body: JSON.stringify(data),
              })
                .then((res) => {
                  console.log(res);
                  if (!res.ok) {
                    throw new Error(res.statusText);
                  }
                  return res.json();
                })
                .then((res) => {
                  if (res.ErrCode == 1) {
                    return Swal.fire({
                      title: "Info",
                      text: res.ErrMsg,
                      type: "error",
                      confirmButtonText: "Ok",
                    }).then(() => {
                      window.location.assign("https://tuyensinh.lhu.edu.vn");
                      return false;
                    });
                  } else {
                    return true;
                  }
                })
                .catch((error) => {
                  Swal.showValidationMessage(`Request failed: ${error}`);
                });
            },
            allowOutsideClick: false,
          }).then((result) => {
            console.log(result);
            if (result.value) {
              this.resetForm();
              console.log(this.dataForm);
              Swal.fire(
                "Chúc mừng!",
                "Bạn đã đăng ký xét tuyển thành công, vui lòng đợi thông tin kết quả xét tuyển từ trường Đại học Lạc Hồng.",
                "success"
              ).then(() => {
                window.location.assign("https://tuyensinh.lhu.edu.vn");
              });
            }
          });
          return;
        }
        Swal.fire({
          title: "Thiếu thông tin",
          text: "Vui lòng nhập đầy đủ thông tin.",
          type: "error",
          confirmButtonText: "Ok",
        });
      });
    },
    handleChangeTuyenThang() {
      const mota =
        this.lsDTTT.find(
          (x) => x.IdTuyenThang == this.dataForm.DoiTuongTuyenThang
        ).MoTaTuyenThang || "";
      this.dataForm.TuyenThang = mota;
    },
    handleChangeNganh(e) {
      // if (
      //   this.lsNganh.filter((x) => x.NganhID === this.dataForm.NganhID).length >
      //   0
      // ) {
      //   this.maNganh =
      //     this.lsNganh.find((x) => x.NganhID === this.dataForm.NganhID)
      //       .MaNganhMoi || "";
      if (this.dataForm.NganhID) {
        fetch(`${this.tapiUrl}/tohop/${this.dataForm.NganhID}`, {
          method: "GET",
          ...headerHttp,
        })
          .then((res) => res.json())
          .then((res) => {
            this.lsToHop = res.data;
          });
      }
    },
    handleChangePhuongThuc() {
      this.dataForm.DiemMon1 = null;
      this.dataForm.DiemMon2 = null;
      this.dataForm.DiemMon3 = null;
      this.dataForm.DiemTB = null;
      if (
        this.dataForm.PhuongThucXetTuyen === 0 ||
        this.dataForm.PhuongThucXetTuyen === 2 ||
        this.dataForm.PhuongThucXetTuyen === 4 ||
        this.dataForm.PhuongThucXetTuyen === 5 ||
        this.dataForm.PhuongThucXetTuyen === 6
      ) {
        this.isDiemTB = false;
      } else {
        this.isDiemTB = true;
      }
      if (this.dataForm.PhuongThucXetTuyen === 3) {
        this.isDGNL = true;
      } else {
        this.isDGNL = false;
      }
    },
    handleChangeToHop() {
      if (this.dataForm.ToHopMonID) {
        fetch(`${this.tapiUrl}/mon/${this.dataForm.ToHopMonID}`, {
          method: "GET",
          ...headerHttp,
        })
          .then((res) => res.json())
          .then((res) => {
            this.lsMon = res.data;
          });
      }
    },
    copyAbove(control) {
      if (control === 11) {
        this.lsQuanHuyen11 = this.lsQuanHuyen10;
        this.lsTruongTHPT11 = this.lsTruongTHPT10;
        this.dataForm.MaTinhTPLop11 = this.dataForm.MaTinhTPLop10;
        this.dataForm.MaQuanHuyenLop11 = this.dataForm.MaQuanHuyenLop10;
        this.dataForm.MaTruongLop11 = this.dataForm.MaTruongLop10;
      }
      if (control === 12) {
        this.lsQuanHuyen12 = this.lsQuanHuyen10;
        this.lsTruongTHPT12 = this.lsTruongTHPT10;
        this.dataForm.MaTinhTPLop12 = this.dataForm.MaTinhTPLop10;
        this.dataForm.MaQuanHuyenLop12 = this.dataForm.MaQuanHuyenLop10;
        this.dataForm.MaTruongLop12 = this.dataForm.MaTruongLop10;
      }
    },
  },
});

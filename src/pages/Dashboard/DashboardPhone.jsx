import React from "react";
import BottomNav from '../../component/Layout/BottomNav';
import styles from "./Dashboard.module.css";
export default (props) => {
	return (
		<div className="flex flex-col bg-white">
			<div className="flex flex-col items-start self-stretch bg-white">
				<div className="flex items-center self-stretch bg-[#D9D9D9] py-[18px] mb-[68px]">
					<img
						src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/6xcd1bom_expires_30_days.png"} 
						className="w-[87px] h-[74px] ml-11 mr-4 object-fill"
					/>
					<span className="text-[#374DB7] text-[40px] font-bold" >
						{"FinSmart"}
					</span>
					<div className="flex-1 self-stretch">
					</div>
					<img
						src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/3wfswsvx_expires_30_days.png"} 
						className="w-[18px] h-6 mr-[7px] object-fill"
					/>
					<span className="text-[#F44336] text-xl mr-[65px]" >
						{"Keluar"}
					</span>
				</div>
				<span className="text-black text-[35px] font-bold mb-[9px] ml-[38px]" >
					{"Selamat Datang, Faris!"}
				</span>
				<span className="text-black text-sm mb-[39px] ml-[38px]" >
					{"Lanjutkan perjalan literasi keuangan Anda hari ini"}
				</span>
				<div className="flex flex-col items-start self-stretch bg-[#F1F1F1] pt-[17px] mb-[45px] mx-[38px] rounded-[5px]">
					<span className="text-black text-xl mb-[25px] ml-[63px]" >
						{"Progres Belajar"}
					</span>
					<div className="flex items-start self-stretch mb-[52px] ml-[93px] mr-[45px] gap-[53px]">
						<div className="flex flex-col shrink-0 items-start bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/k4u0uvhs_expires_30_days.png')] bg-cover bg-center"
							style={{
								backgroundImage: 'url(https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/k4u0uvhs_expires_30_days.png)',
							}}
							>
							<div className="flex flex-col items-center bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/ffifh83d_expires_30_days.png')] bg-cover bg-center py-[34px] px-6 gap-1.5"
								style={{
									backgroundImage: 'url(https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/ffifh83d_expires_30_days.png)',
								}}
								>
								<span className="text-black text-base font-bold" >
									{"75%"}
								</span>
								<span className="text-black text-[11px]" >
									{"Complete"}
								</span>
							</div>
						</div>
						<div className="flex flex-1 flex-col items-start">
							<span className="text-black text-sm" >
								{"Modul Selesai"}
							</span>
							<div className="flex flex-col items-end self-stretch mb-1">
								<span className="text-black text-xs" >
									{"12/16"}
								</span>
							</div>
							<div className="items-start self-stretch bg-white mb-[22px]">
								<div className="bg-emerald-400 w-[833px] h-1.5">
								</div>
							</div>
							<div className="flex justify-between items-center self-stretch mb-[3px]">
								<span className="text-black text-sm" >
									{"Kuis Selesai"}
								</span>
								<span className="text-black text-xs" >
									{"8/12"}
								</span>
							</div>
							<div className="items-start self-stretch bg-white">
								<div className="bg-emerald-400 w-[612px] h-1.5">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-start self-stretch bg-[#5934D3] pt-5 pr-[45px] mb-11 mx-[38px] rounded-[5px]">
					<span className="text-white text-xl mb-[9px] ml-[33px]" >
						{"Quiz Harian"}
					</span>
					<span className="text-white text-sm mb-[43px] ml-[33px]" >
						{"Uji pengetahuan Anda dengan kuis harian dan dapatkan badge ekslusif!"}
					</span>
					<div className="flex justify-between items-start self-stretch mb-[39px] ml-7">
						<div className="flex flex-col shrink-0 items-start gap-[15px]">
							<span className="text-white text-[32px] ml-2.5 mr-[76px]" >
								{"5"}
							</span>
							<span className="text-white text-[11px]" >
								{"Pertanyaan tersedia"}
							</span>
						</div>
						<button className="flex flex-col shrink-0 items-start bg-white text-left py-[9px] px-[37px] mt-[17px] rounded-[20px] border-0"
							onClick={()=>alert("Pressed!")}>
							<span className="text-[#5934D3] text-xl" >
								{"Mulai"}
							</span>
						</button>
					</div>
				</div>
				<div className="flex justify-between items-center self-stretch mb-[19px] mx-[41px]">
					<span className="text-black text-xl" >
						{"Module Terbaru"}
					</span>
					<div className="flex shrink-0 items-center gap-[3px]">
						<span className="text-emerald-400 text-xl" >
							{"Lihat Semua"}
						</span>
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/q0l9ikfp_expires_30_days.png"} 
							className="w-[18px] h-[18px] object-fill"
						/>
					</div>
				</div>
				<div className="flex flex-col items-start self-stretch bg-[#F1F1F1] pt-[17px] pr-7 mx-[38px] rounded-[5px]">
					<div className="flex items-center mb-[33px] ml-[19px] gap-[7px]">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/xo90pooo_expires_30_days.png"} 
							className="w-[42px] h-[42px] object-fill"
						/>
						<span className="text-black text-xl" >
							{"Manejement Utang"}
						</span>
					</div>
					<span className="text-black text-xs w-[305px] mb-5 ml-7" >
						{"Pelajari cara mengelola dan mengurangi utang secara efektif"}
					</span>
					<div className="flex justify-between items-center self-stretch mb-3 ml-7">
						<span className="text-black text-xs" >
							{"Progress"}
						</span>
						<span className="text-black text-xs" >
							{"60%"}
						</span>
					</div>
					<div className="items-start self-stretch bg-white mb-[43px] ml-7">
						<div className="bg-emerald-400 w-[864px] h-1.5">
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center self-stretch mb-[31px]">
					<span className="text-white text-xl" >
						{"Logout"}
					</span>
				</div>
				<div className="flex flex-col items-start self-stretch bg-[#F1F1F1] pt-[17px] pr-7 mb-[55px] mx-[38px] rounded-[5px]">
					<div className="flex items-center mb-[33px] ml-5 gap-1.5">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/67z0oz9p_expires_30_days.png"} 
							className="w-[42px] h-[42px] object-fill"
						/>
						<span className="text-black text-xl" >
							{"Dasar investasi"}
						</span>
					</div>
					<span className="text-black text-xs w-[315px] mb-5 ml-6" >
						{"Pahami konsep dasar investasi untuk masa depan yang lebih baik"}
					</span>
					<div className="flex justify-between items-center self-stretch mb-3 ml-7">
						<span className="text-black text-xs" >
							{"Progress"}
						</span>
						<span className="text-black text-xs" >
							{"30%"}
						</span>
					</div>
					<div className="items-start self-stretch bg-white mb-[43px] ml-7">
						<div className="bg-emerald-400 w-[314px] h-1.5">
						</div>
					</div>
				</div>
				<div className="flex flex-col items-start self-stretch bg-[#F1F1F1] pt-4 mb-[154px] mx-[38px] rounded-[5px]">
					<div className="flex items-center mb-9 ml-[21px] gap-[9px]">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/rv566hip_expires_30_days.png"} 
							className="w-[41px] h-[41px] object-fill"
						/>
						<span className="text-black text-xl" >
							{"Dasar Penganggaran"}
						</span>
					</div>
					<span className="text-black text-xs mb-8 ml-7" >
						{"Buat dan kelola anggaran bulanan dengan mudah"}
					</span>
					<div className="flex justify-between items-center self-stretch mb-3 ml-7 mr-[41px]">
						<span className="text-black text-xs" >
							{"Progress"}
						</span>
						<span className="text-black text-xs" >
							{"0%"}
						</span>
					</div>
					<div className="self-stretch bg-white h-1.5 mb-[43px] mx-7">
					</div>
				</div>
				<div className="flex items-start self-stretch bg-[#D9D9D9] pt-[25px] pb-[39px] px-[167px]">
					<div className="flex flex-col shrink-0 items-start mr-[114px] gap-1.5">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/kmcaoar6_expires_30_days.png"} 
							className="w-[47px] h-[47px] ml-[27px] object-fill"
						/>
						<span className="text-[#0015FF] text-xl" >
							{"Dashboard"}
						</span>
					</div>
					<div className="flex flex-col shrink-0 items-center gap-[13px]">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/dlatv272_expires_30_days.png"} 
							className="w-[41px] h-[29px] object-fill"
						/>
						<span className="text-black text-xl" >
							{"Learning Modules"}
						</span>
					</div>
					<div className="flex-1 self-stretch">
					</div>
					<div className="flex flex-col shrink-0 items-start gap-2.5">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/6aqseeml_expires_30_days.png"} 
							className="w-[47px] h-[47px] ml-[13px] object-fill"
						/>
						<span className="text-black text-xl" >
							{"Quizzes"}
						</span>
					</div>
					<div className="flex-1 self-stretch">
					</div>
					<div className="flex flex-col shrink-0 items-start mr-[201px] gap-[13px]">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/9lfy52x9_expires_30_days.png"} 
							className="w-[47px] h-[47px] ml-[31px] object-fill"
						/>
						<div className="flex flex-col items-start px-[1px]">
							<span className="text-black text-xl" >
								{"Calculators"}
							</span>
						</div>
					</div>
					<div className="flex flex-col shrink-0 items-start gap-2">
						<img
							src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/KssvpwxTdd/t81daglj_expires_30_days.png"} 
							className="w-[47px] h-[47px] object-fill"
						/>
						<span className="text-black text-xl" >
							{"Profile"}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
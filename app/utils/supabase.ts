import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

//개발db, 운영db 분리하기
const supabaseDb = process.env.NODE_ENV == 'development' ? 'user_stats_3_dev' : 'user_stats_3';
const userInfoPerDate = process.env.NODE_ENV == 'development' ? 'user_info_per_date_dev' : 'user_info_per_date';
const supabase = createClient(supabaseUrl, supabaseKey);


// fid에 해당하는 데이터 가져오기 함수
export const fetchUserData = async (fid: number) => {
    const { data, error } = await supabase
      .from(supabaseDb)
      .select('*')
      .eq('fid', fid)
      .single();
  
    if (error) {
      if (error.code !== 'PGRST116') { // row가 없는 경우 에러를 제외
        console.error("Supabase 데이터 검색 오류:", error);
        throw new Error('Error fetching data from Supabase');
      }
      return null;
    }
  
    return data;
};

// 데이터를 업데이트 또는 삽입하는 함수
export const updateInsertUserData = async (userData: any) => {
    const { fid } = userData;

    console.warn("updateInsertUserData=" + JSON.stringify(userData));
  
    // 기존 데이터가 있는지 확인
    const existingEntry = await fetchUserData(fid);
  
    if (existingEntry) {
      // 업데이트
      const { error: updateError } = await supabase
        .from(supabaseDb)
        .update({
          ...userData,
          mod_dtm: getKoreanISOString()
        })
        .eq('fid', fid);
  
      if (updateError) {
        console.error("Supabase 데이터 업데이트 오류:", updateError);
        throw new Error('Error updating data in Supabase');
      }
    } else {
      // 삽입
      const { error: insertError } = await supabase
        .from(supabaseDb)
        .insert([{
          ...userData,
          reg_dtm: getKoreanISOString()
        }]);
  
      if (insertError) {
        console.error("Supabase 데이터 삽입 오류:", insertError);
        throw new Error('Error inserting data into Supabase');
      }
    }
};


// fid에 해당하는 데이터 가져오기 함수(랭킹, 이용가능한클레임의 차트만들기용)
export const fetchUserDataForChart = async (fid: number) => {
  const koreanDate = getKoreanYYYYMMDD(new Date());

  const { data, error } = await supabase
    .from(userInfoPerDate)
    .select('*')
    .eq('record_date', koreanDate)
    .eq('fid', fid);

  if (error) {
    if (error.code !== 'PGRST116') { // row가 없는 경우 에러를 제외
      console.error("Supabase 데이터 검색 오류:", error);
      throw new Error('Error fetching data from Supabase');
    }
    return null;
  }

  return data;
};

// 데이터를 업데이트 또는 삽입하는 함수(랭킹, 이용가능한클레임의 차트만들기용)
export const updateInsertUserDataForChart = async (userDataForChart: any) => {
  const { fid } = userDataForChart;
  const { far_rank } = userDataForChart;
  let { available_claim_amount } = userDataForChart;
  const new_available_claim_amount = available_claim_amount; //case when 쓰기위해

  console.warn("updateInsertUserDataForChart=" + JSON.stringify(userDataForChart));

  // 기존 데이터가 있는지 확인
  const existingEntry = await fetchUserDataForChart(fid);

  console.log("#########existingEntry=" + JSON.stringify(existingEntry));

  const koreanDate = getKoreanYYYYMMDD(new Date());

  //availableClaimAmount 값이 0이면 업데이트시 db에 있는 기존값으로 업데이트
  //available_claim_amount = '0'; //테스트용 db에 값이 21000이 있지만 후에 클레임 후 api에서 받은값이 0일때 
  console.log("typeof available_claim_amount=" + typeof available_claim_amount);
  console.log("##############available_claim_amount=" + available_claim_amount);
  if (existingEntry != null && existingEntry.length > 0) {
    // available_claim_amount를 조건에 따라 처리
    const new_available_claim_amount = available_claim_amount === '0.00'
        ? existingEntry[0].available_claim_amount // new_available_claim_amount가 0이면 기존 값을 유지
        : available_claim_amount; // 아니면 새로운 값으로 업데이트

    console.log("#############new_available_claim_amount=" + new_available_claim_amount);

    // 업데이트
    const { error: updateError } = await supabase
      .from(userInfoPerDate)
      .update({
        record_date: koreanDate,
        fid: fid,
        far_rank: far_rank,
        available_claim_amount: new_available_claim_amount,
        mod_dtm: getKoreanISOString()
      })
      .eq('record_date', koreanDate)
      .eq('fid', fid);

    if (updateError) {
      console.error("Supabase 데이터 업데이트 오류:", updateError);
      throw new Error('Error updating data in Supabase');
    }
   } else {
    // 삽입
    const { error: insertError } = await supabase
      .from(userInfoPerDate)
      .insert([{
        record_date: koreanDate,
        fid: fid,
        far_rank: far_rank,
        available_claim_amount: available_claim_amount,
        reg_dtm: getKoreanISOString()
      }]);

    if (insertError) {
      console.error("Supabase 데이터 삽입 오류:", insertError);
      throw new Error('Error inserting data into Supabase');
    }
  }
};

function getKoreanISOString() {
    const now = new Date();
    const koreanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9 시간대 반영
    return koreanTime.toISOString().slice(0, 19).replace('T', ' ');
}

const getKoreanYYYYMMDD = (date: Date): string => {
  const koreanTime = new Date(date.getTime()); // UTC에서 9시간 더하기 (KST 변환)

  const year = koreanTime.getFullYear();
  const month = String(koreanTime.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
  const day = String(koreanTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;

declare_id!("FAwTaMVpFMsBWrHhMSrwpECmixYP6F9ToSzPRgGCfAEu");

#[program]
pub mod youth_certification {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.authority = ctx.accounts.authority.key();
        platform.total_certificates = 0;
        platform.total_institutions = 0;
        Ok(())
    }

    pub fn register_institution(
        ctx: Context<RegisterInstitution>,
        name: String,
        verification_hash: String,
    ) -> Result<()> {
        require!(name.len() <= 64, CustomError::NameTooLong);
        require!(verification_hash.len() <= 64, CustomError::HashTooLong);

        let institution = &mut ctx.accounts.institution;
        let platform = &mut ctx.accounts.platform;

        institution.authority = ctx.accounts.authority.key();
        institution.name = name;
        institution.verification_hash = verification_hash;
        institution.is_verified = false;
        institution.certificates_issued = 0;
        institution.created_at = Clock::get()?.unix_timestamp;

        platform.total_institutions += 1;

        emit!(InstitutionRegistered {
            institution: institution.key(),
            name: institution.name.clone(),
            authority: institution.authority,
        });

        Ok(())
    }

    pub fn verify_institution(ctx: Context<VerifyInstitution>) -> Result<()> {
        let institution = &mut ctx.accounts.institution;
        institution.is_verified = true;

        emit!(InstitutionVerified {
            institution: institution.key(),
            name: institution.name.clone(),
        });

        Ok(())
    }

    pub fn issue_certificate(
        ctx: Context<IssueCertificate>,
        student_name: String,
        course_name: String,
        course_duration: u32,
        skills_acquired: Vec<String>,
        grade: String,
        metadata_uri: String,
    ) -> Result<()> {
        require!(student_name.len() <= 64, CustomError::NameTooLong);
        require!(course_name.len() <= 128, CustomError::CourseTooLong);
        require!(grade.len() <= 10, CustomError::GradeTooLong);
        require!(skills_acquired.len() <= 20, CustomError::TooManySkills);
        require!(metadata_uri.len() <= 200, CustomError::URITooLong);

        let certificate = &mut ctx.accounts.certificate;
        let institution = &mut ctx.accounts.institution;
        let platform = &mut ctx.accounts.platform;

        require!(institution.is_verified, CustomError::InstitutionNotVerified);

        // Generate certificate hash for integrity
        let certificate_data = format!(
            "{}{}{}{}{}",
            student_name,
            course_name,
            course_duration,
            grade,
            Clock::get()?.unix_timestamp
        );
        let hash_result = hash(certificate_data.as_bytes());

        certificate.student_wallet = ctx.accounts.student.key();
        certificate.institution = institution.key();
        certificate.student_name = student_name;
        certificate.course_name = course_name;
        certificate.course_duration = course_duration;
        certificate.skills_acquired = skills_acquired;
        certificate.grade = grade;
        certificate.issued_at = Clock::get()?.unix_timestamp;
        certificate.certificate_hash = hash_result.to_string();
        certificate.metadata_uri = metadata_uri;
        certificate.is_revoked = false;

        institution.certificates_issued += 1;
        platform.total_certificates += 1;

        emit!(CertificateIssued {
            certificate: certificate.key(),
            student: certificate.student_wallet,
            institution: institution.key(),
            course_name: certificate.course_name.clone(),
            issued_at: certificate.issued_at,
        });

        Ok(())
    }

    pub fn verify_certificate(ctx: Context<VerifyCertificate>) -> Result<CertificateData> {
        let certificate = &ctx.accounts.certificate;

        require!(!certificate.is_revoked, CustomError::CertificateRevoked);

        Ok(CertificateData {
            student_wallet: certificate.student_wallet,
            institution: certificate.institution,
            student_name: certificate.student_name.clone(),
            course_name: certificate.course_name.clone(),
            course_duration: certificate.course_duration,
            skills_acquired: certificate.skills_acquired.clone(),
            grade: certificate.grade.clone(),
            issued_at: certificate.issued_at,
            certificate_hash: certificate.certificate_hash.clone(),
            is_revoked: certificate.is_revoked,
        })
    }

    pub fn revoke_certificate(ctx: Context<RevokeCertificate>, index: u64) -> Result<()> {
        let certificate = &mut ctx.accounts.certificate;
        certificate.is_revoked = true;

        emit!(CertificateRevoked {
            certificate: certificate.key(),
            institution: certificate.institution,
            revoked_at: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn get_student_certificates(ctx: Context<GetStudentCertificates>) -> Result<Vec<Pubkey>> {
        // This would typically return a list of certificate public keys
        // In practice, you'd query this off-chain due to Solana's data limitations
        Ok(vec![])
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Platform::INIT_SPACE,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterInstitution<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Institution::INIT_SPACE,
        seeds = [b"institution", authority.key().as_ref()],
        bump
    )]
    pub institution: Account<'info, Institution>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VerifyInstitution<'info> {
    #[account(
        mut,
        seeds = [b"institution", institution.authority.as_ref()],
        bump
    )]
    pub institution: Account<'info, Institution>,
    #[account(
        seeds = [b"platform"],
        bump,
        has_one = authority
    )]
    pub platform: Account<'info, Platform>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct IssueCertificate<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Certificate::INIT_SPACE,
        seeds = [
            b"certificate",
            institution.key().as_ref(),
            student.key().as_ref(),
            &institution.certificates_issued.to_le_bytes()
        ],
        bump
    )]
    pub certificate: Account<'info, Certificate>,
    #[account(
        mut,
        seeds = [b"institution", authority.key().as_ref()],
        bump,
        has_one = authority,
        constraint = institution.is_verified @ CustomError::InstitutionNotVerified
    )]
    pub institution: Account<'info, Institution>,
    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,
    /// CHECK: Student wallet address
    pub student: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(index: u64)]
pub struct VerifyCertificate<'info> {
    #[account(
        seeds = [
            b"certificate",
            certificate.institution.as_ref(),
            certificate.student_wallet.as_ref(),
            index.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub certificate: Account<'info, Certificate>,
}

#[derive(Accounts)]
#[instruction(index: u64)]
pub struct RevokeCertificate<'info> {
    #[account(
        mut,
        seeds = [
            b"certificate",
            certificate.institution.as_ref(),
            certificate.student_wallet.as_ref(),
            index.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub certificate: Account<'info, Certificate>,
    #[account(
        seeds = [b"institution", authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub institution: Account<'info, Institution>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetStudentCertificates<'info> {
    /// CHECK: Student wallet address
    pub student: AccountInfo<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Platform {
    pub authority: Pubkey,
    pub total_certificates: u64,
    pub total_institutions: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Institution {
    pub authority: Pubkey,
    #[max_len(64)]
    pub name: String,
    #[max_len(64)]
    pub verification_hash: String,
    pub is_verified: bool,
    pub certificates_issued: u64,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Certificate {
    pub student_wallet: Pubkey,
    pub institution: Pubkey,
    #[max_len(64)]
    pub student_name: String,
    #[max_len(128)]
    pub course_name: String,
    pub course_duration: u32,
    #[max_len(20, 32)]
    pub skills_acquired: Vec<String>,
    #[max_len(10)]
    pub grade: String,
    pub issued_at: i64,
    #[max_len(64)]
    pub certificate_hash: String,
    #[max_len(200)]
    pub metadata_uri: String,
    pub is_revoked: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CertificateData {
    pub student_wallet: Pubkey,
    pub institution: Pubkey,
    pub student_name: String,
    pub course_name: String,
    pub course_duration: u32,
    pub skills_acquired: Vec<String>,
    pub grade: String,
    pub issued_at: i64,
    pub certificate_hash: String,
    pub is_revoked: bool,
}

#[event]
pub struct InstitutionRegistered {
    pub institution: Pubkey,
    pub name: String,
    pub authority: Pubkey,
}

#[event]
pub struct InstitutionVerified {
    pub institution: Pubkey,
    pub name: String,
}

#[event]
pub struct CertificateIssued {
    pub certificate: Pubkey,
    pub student: Pubkey,
    pub institution: Pubkey,
    pub course_name: String,
    pub issued_at: i64,
}

#[event]
pub struct CertificateRevoked {
    pub certificate: Pubkey,
    pub institution: Pubkey,
    pub revoked_at: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("Name is too long")]
    NameTooLong,
    #[msg("Course name is too long")]
    CourseTooLong,
    #[msg("Grade is too long")]
    GradeTooLong,
    #[msg("Too many skills")]
    TooManySkills,
    #[msg("URI is too long")]
    URITooLong,
    #[msg("Hash is too long")]
    HashTooLong,
    #[msg("Institution is not verified")]
    InstitutionNotVerified,
    #[msg("Certificate is revoked")]
    CertificateRevoked,
}
